/* import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import Bottleneck from 'bottleneck';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PessoaService } from '../../pessoa/services/pessoa.service';
import { LINKSINTEGRATION } from 'src/modules/integracao/services/links-integracao';
import { parseStringPromise } from 'xml2js'; // Importação para converter XML para JSON
import { DocumentoFiscal } from 'src/modules/documento-fiscal/entities/documento-fiscal.entity';
import { ItemDocumentoFiscal } from 'src/modules/documento-fiscal/entities/item-documento-fiscal.entity';
import { ImpostoDocumentoFiscal } from 'src/modules/documento-fiscal/entities/imposto-documento-fiscal.entity';
import { FluxoCaixa } from 'src/modules/documento-fiscal/entities/fluxo-caixa.entity';
import { DocumentoFiscalDTO, FluxoCaixaDTO, ImpostoDTO, ItemDocumentoFiscalDTO } from 'src/modules/documento-fiscal/dto/doc-fiscal.dto';

export class ErpExtractor extends WorkerHost {
    private readonly logger = new Logger(ErpExtractor.name);
    private limiter: Bottleneck;

    constructor(
        private readonly pessoaService: PessoaService,
        @InjectRepository(DocumentoFiscal)
        private readonly documentoFiscalRepository: Repository<DocumentoFiscal>,
        @InjectRepository(ItemDocumentoFiscal)
        private readonly itemDocumentoFiscalRepository: Repository<ItemDocumentoFiscal>,
        @InjectRepository(ImpostoDocumentoFiscal)
        private readonly impostoDocumentoFiscalRepository: Repository<ImpostoDocumentoFiscal>,
        @InjectRepository(FluxoCaixa)
        private readonly fluxoCaixaRepository: Repository<FluxoCaixa>,
        @InjectQueue('erp-extract-processor') private readonly erpDataQueue: Queue,
    ) {
        super();
        this.initializeLimiter();
    }

    @OnWorkerEvent('active')
    onActive(job: Job) {
      console.log(
        `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
      );
    }

    @OnWorkerEvent('progress')
    onProgress(job: Job) {
      const { id, name, progress } = job;
      this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
    }
    

    initializeLimiter() {
        this.limiter = new Bottleneck({
            reservoir: 30, // Limite máximo de requisições
            reservoirRefreshAmount: 30,
            reservoirRefreshInterval: 60 * 1000, // 1 minuto
            maxConcurrent: 1,
        });
    }

    // Processa os jobs da fila

    async process(job: Job): Promise<void> {
        const { clienteId, erp } = job.data;
        this.logger.log(`Processando ETL para o cliente ${clienteId} e ERP ${erp}`);

        try {

            this.logger.log(`PASSOU AQUI !`);
            const cliente = await this.pessoaService.findById(clienteId);
            this.logger.log(`Passou aqui ? `);
            this.logger.log(`${erp} ; ${clienteId}  `);
            if (erp === 'tiny') {
                this.logger.log(`Sim ?????`);
                await this.processarNotasTiny(cliente);
            } else if (erp === 'omie') {
                await this.processarNotasOmie(cliente);
            } else {
                throw new Error('ERP não suportado');
            }

        } catch (error) {
            this.logger.error(`Erro ao processar o cliente ${clienteId}: ${error.message}`);
            throw error;
        }
    }

    // Processar notas do Tiny com controle de requisições
    async processarNotasTiny(cliente: any) {
        const notasTiny = await this.limiter.schedule(() => this.buscarListaNotasTiny(cliente.cdPessoa));

        for (const nota of notasTiny.data) {
            const detalheNota = await this.limiter.schedule(() => this.buscarDetalhamentoNotaTiny(nota.id, notasTiny.client[0]['apiKey']['token']['app_key']));

            const documentoFiscalDTO = new DocumentoFiscalDTO(detalheNota);
            const itensDTO = detalheNota.itens.map((item: any) => new ItemDocumentoFiscalDTO(item));
            const impostosDTO = detalheNota.imposto.map((imposto: any) => new ImpostoDTO(imposto));


            await this.gravarDocumentoFiscal(documentoFiscalDTO, itensDTO, impostosDTO);
        }
    }

    // Método para buscar a lista de notas no Tiny
    async buscarListaNotasTiny(clientId: number) {
        const cliente = await this.pessoaService.findById(clientId);
        const token = cliente[0]['apiKey']['token']['app_key'];

        const page = {
            numero_paginas: 0,
            pagina: 1,
        };
        const results: any[] = [];

        do {
            try {
                const result = await this.limiter.schedule(() =>
                    axios.get(`${LINKSINTEGRATION.TINY_GET_ALL_DOCUMENTS}`, {
                        params: {
                            token: token,
                            formato: 'json',
                            pagina: page.pagina,
                        },
                    })
                );
                
                results.push(...result.data.retorno.notasfiscais);
                page.pagina++;
                page.numero_paginas = result.data.retorno.numero_paginas;
                this.logger.log(`Processando Notas página ${page.pagina} de ${page.numero_paginas}`);
            } catch (error) {
                this.logger.error(error)
                throw new HttpException('Erro ao buscar notas no Tiny', HttpStatus.BAD_GATEWAY);
            }
        } while (page.pagina <= page.numero_paginas);

        return {
            client: cliente,
            data: results,
        };
    }

    // Método para buscar o detalhamento de uma nota específica no Tiny
    async buscarDetalhamentoNotaTiny(documentId: string, token: string) {
        try {
            const response = await this.limiter.schedule(() =>
                axios.get(`${LINKSINTEGRATION.TINY_GET_DOCUMENT_DETAIL}`, {
                    params: {
                        token: token,
                        formato: 'json',
                        id: documentId,
                    },
                })
            );
            return response.data.retorno.nota;
        } catch (error) {
            this.logger.error(error)
            throw new HttpException('Erro ao buscar detalhamento da nota no Tiny', HttpStatus.BAD_GATEWAY);
        }
    }

    // Processar notas do Omie com controle de requisições e conversão de XML
    async processarNotasOmie(cliente: any) {
        const notasOmie = await this.limiter.schedule(() => this.buscarNotasOmie(cliente.cdPessoa));

        for (const xmlNota of notasOmie) {
            const notaJson = await this.xmlToJson(xmlNota); // Converter XML para JSON aqui

            const documentoFiscalDTO = new DocumentoFiscalDTO(notaJson);
            const itensDTO = notaJson.itens.map((item: any) => new ItemDocumentoFiscalDTO(item));
            const impostosDTO = notaJson.imposto.map((imposto: any) => new ImpostoDTO(imposto));

            await this.gravarDocumentoFiscal(documentoFiscalDTO, itensDTO, impostosDTO);
        }
    }

    async buscarNotasOmie(clientId: number) {
        const cliente = await this.pessoaService.findById(clientId);
        const token = cliente[0]['apiKey']['token'];

        try {
            const result = await this.limiter.schedule(() =>
                axios.post<any>(
                    LINKSINTEGRATION.OMIE_GET_DOCUMENT,
                    {
                        app_key: token.app_key,
                        app_secret:token.app_secret,
                        call: 'ListarNotasFiscais',
                        param: [{ pagina: 1, registros_por_pagina: 50 }],
                    }
                )
            );
            return result.data.xml; // XML será retornado aqui para ser convertido depois
        } catch (erro) {
            throw new HttpException('Erro ao buscar notas no Omie', HttpStatus.BAD_GATEWAY);
        }
    }

    // Função para converter XML para JSON
    private async xmlToJson(xml: string): Promise<any> {
        try {
            const result = await parseStringPromise(xml, {
                explicitArray: false, // Remove arrays desnecessários
                mergeAttrs: true, // Mescla atributos com o nó pai
            });
            return result;
        } catch (error) {
            this.logger.error(error)
            throw new Error(`Erro ao converter XML para JSON: ${error.message}`);
        }
    }

    // Conversão de Fluxo de Caixa do Tiny para DTO
    private converterFluxoCaixaTinyParaDTO(detalheNota: any): FluxoCaixaDTO {
        // Simulando o cálculo baseado no detalhe da nota
        const fluxoCaixaDTO = new FluxoCaixaDTO(detalheNota);
        return fluxoCaixaDTO;
    }

    // Conversão de Fluxo de Caixa do Omie para DTO
    private converterFluxoCaixaOmieParaDTO(notaJson: any): FluxoCaixaDTO {
        const fluxoCaixaDTO = new FluxoCaixaDTO(notaJson);
        return fluxoCaixaDTO;
    }

    private async gravarDocumentoFiscal(
        documentoFiscalDTO: DocumentoFiscalDTO,
        itensDTO: ItemDocumentoFiscalDTO[],
        impostosDTO: ImpostoDTO[]
    ) {
        // Gravação do documento fiscal
        const documentoFiscal = await this.documentoFiscalRepository.save(documentoFiscalDTO);
    
        // Processa cada item do DTO e salva no banco de dados
        for (const itemDTO of itensDTO) {
            // Transformando o DTO em uma entidade ItemDocumentoFiscal
            const item = new ItemDocumentoFiscal();
            item.cdDocumentoFiscal = documentoFiscal;
            item.cdProdutoServico = itemDTO.codigoProduto;
            item.dsProdutoServico = itemDTO.descricao;
            item.vlItem = itemDTO.valorTotal;
            item.dsComplementar = itemDTO.descricaoComplementar;
            item.vlAdicional = itemDTO.valorAdicional;
            item.vlCustoItem = itemDTO.valorCusto; // Esse valor pode ser calculado ou fornecido
            item.vlDescontoItem = itemDTO.valorDesconto;
            item.vlImpostoItem = itemDTO.valorImposto;
            item.vlLucroItem = itemDTO.valorLucro; // Esse valor pode ser calculado
    
            // Salvando o item no banco de dados
            const itemSalvo = await this.itemDocumentoFiscalRepository.save(item);
    
            // Gravação dos impostos do item
            for (const impostoDTO of impostosDTO) {
                const impostoDocumentoFiscal = new ImpostoDocumentoFiscal();
                impostoDocumentoFiscal.cdItemDocumentoFiscal = itemSalvo;
                impostoDocumentoFiscal.vlImposto = impostoDTO.vlImposto;
                impostoDocumentoFiscal.vlBaseCalculo = impostoDTO.vlBaseCalculo;
                await this.impostoDocumentoFiscalRepository.save(impostoDocumentoFiscal);
            }
        }

    }
}
 */