import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PessoaService } from '../../pessoa/services/pessoa.service';
import { DocumentoFiscalDTO, ImpostoDTO, ItemDocumentoFiscalDTO, RespostaDTO } from '../dto/doc-fiscal.dto';
import Bottleneck from 'bottleneck';
import { LINKSINTEGRATION } from 'src/modules/integracao/services/links-integracao';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentoFiscal } from '../entities/documento-fiscal.entity';
import { ItemDocumentoFiscal } from '../entities/item-documento-fiscal.entity';
import { ImpostoDocumentoFiscal } from '../entities/imposto-documento-fiscal.entity';
import { Repository } from 'typeorm';
import { parseStringPromise } from 'xml2js';
import { Pessoa } from 'src/modules/pessoa/entities/pessoa.entity';
@Injectable()
export class DocumentoFiscalService {
    public readonly logger = new Logger(DocumentoFiscalService.name);
    private limiter: Bottleneck;

    constructor(
        private readonly pessoaService: PessoaService,
        @InjectQueue('extract') private readonly erpDataQueue: Queue,
        @InjectRepository(DocumentoFiscal)
        private readonly documentoFiscalRepository: Repository<DocumentoFiscal>,
        @InjectRepository(ItemDocumentoFiscal)
        private readonly itemDocumentoFiscalRepository: Repository<ItemDocumentoFiscal>,
        @InjectRepository(ImpostoDocumentoFiscal)
        private readonly impostoDocumentoFiscalRepository: Repository<ImpostoDocumentoFiscal>
    ) {
        this.initializeLimiter();
    }

    //Inicializa o limiter
    initializeLimiter() {
        this.limiter = new Bottleneck({
            reservoir: 30, // Limite máximo de requisições
            reservoirRefreshAmount: 30,
            reservoirRefreshInterval: 60 * 1000, // 1 minuto
            maxConcurrent: 1,
        });
    }

    // Adicionar jobs à fila para todos os clientes
    async processarTodosClientes() {
        const clientes = await this.pessoaService.findAll();
        for (const cliente of clientes) {
          await this.erpDataQueue.add('extract', {
              client: cliente,
              erp: cliente.cdErp.dsErp
          });
      }
    }



    // Processar notas do Tiny com controle de requisições
    async processarNotasTiny(cliente: Pessoa) {
    
        this.logger.log(`Params:${cliente.nmPessoa}, 
            ${await this.getFormatDate(await this.getStartOfLastYear())},
            ${await this.getFormatDate()},
            ${ this.limiter}`)

        const notasTiny = await this.limiter.schedule(async () => 
            await this.buscarListaNotasTiny(cliente,
            await this.getFormatDate(await this.getStartOfLastYear()), //Pegar data de inicio do ano passado
            await this.getFormatDate() //Pegar data de hojer
            ));

        for (const nota of notasTiny.data) {
            console.log(nota);
            
            const detalheNota = await this.limiter.schedule(() => this.buscarDetalhamentoNotaTiny(nota.nota_fiscal.id, notasTiny.client['apiKey']['token']['app_key']));

            const documentoFiscalDTO = new DocumentoFiscalDTO(detalheNota);
            const itensDTO = detalheNota.itens.map((item: any) => new ItemDocumentoFiscalDTO(item));
            //const impostosDTO = detalheNota.imposto.map((imposto: any) => new ImpostoDTO(imposto));


           // await this.gravarDocumentoFiscal(documentoFiscalDTO, itensDTO, impostosDTO);
        }
    }

     // Método para buscar a lista de notas no Tiny
     async buscarListaNotasTiny(
        client:Pessoa, 
        dataInicial:string, 
        dataFinal:string) {
        const token = client['apiKey']['token']['app_key'];
    
        const limiter = new Bottleneck({
            reservoir: 30, // Limite máximo de requisições
            reservoirRefreshAmount: 30,
            reservoirRefreshInterval: 60 * 1000, // 1 minuto
            maxConcurrent: 1,
        });

        const page = {
            numero_paginas: 0,
            pagina: 1,
        };

        const results = await getAllNfsTiny();
        

        async function getAllNfsTiny(){
           

            const results: any[] = [];    
            
            do {
                try {
                  
                    const result = await limiter.schedule(() =>
                        axios.get(`${LINKSINTEGRATION.TINY_GET_ALL_DOCUMENTS}`, {
                            params: {
                                token: token,
                                formato: 'json',
                                pagina: page.pagina,
                                dataInicial:dataInicial,
                                dataFinal: dataFinal
                            },
                        })
                    );
                    
                    results.push(...result.data.retorno.notas_fiscais);
                    page.pagina++;
                    page.numero_paginas = result.data.retorno.numero_paginas;
                    console.log(`Processando Notas página ${page.pagina} de ${page.numero_paginas}`);
                } catch (error) {
                    console.error(error)
                    throw new HttpException('Erro ao buscar notas no Tiny', HttpStatus.BAD_GATEWAY);
                }
            } while (page.pagina <= page.numero_paginas);
            return results
        }


        return {
            client: client,
            data: results,
        };
    }




     // Método para buscar o detalhamento de uma nota específica no Tiny
     async buscarDetalhamentoNotaTiny(documentId: string, token: string) {
        
        const limiter = new Bottleneck({
            reservoir: 30, // Limite máximo de requisições
            reservoirRefreshAmount: 30,
            reservoirRefreshInterval: 60 * 1000, // 1 minuto
            maxConcurrent: 1,
        });

        async function getNfDetailTiny(id:string){
            console.log(id)
            try {
                const response = await limiter.schedule(() =>
                    axios.get<{retorno:RespostaDTO}>(`${LINKSINTEGRATION.TINY_GET_DOCUMENT_DETAIL}`, {
                        params: {
                            token: token,
                            id: id,
                        }
                    })
                );
                console.log(`Busca da nota ${id}`);
                console.log(response.data);
                return response.data.retorno.nota_fiscal;
            } catch (error) {
                console.log(error)
                throw new HttpException('Erro ao buscar detalhamento da nota no Tiny', HttpStatus.BAD_GATEWAY);
            }
        }

       return await getNfDetailTiny(documentId);
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


    /* Transform */
    
      async transformData(extractedData: any): Promise<any> {
        // Transformação dos dados extraídos
        // Simulação da transformação dos dados
        return { ...extractedData, dadosTransformados: 'dados transformados' };
      }


      /* Load */

      private async gravarDocumentoFiscal(
        documentoFiscalDTO: DocumentoFiscalDTO,
        itensDTO: ItemDocumentoFiscalDTO[],
        impostosDTO?: ImpostoDTO[]
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

    // Load
    
      async loadData(transformedData: any): Promise<void> {
        // Carregamento dos dados no banco de dados
        // Simulação de persistência no banco
        console.log(`Persistindo dados transformados para o cliente ${transformedData.clienteId}`);
      }
    //Load data 
    async getFormatDate(dt?:Date){
        const date = dt ? dt : new Date();
        const day = date.getDate().toString().padStart(2, '0'); // Obtém o dia com dois dígitos
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês com dois dígitos (lembrando de adicionar 1)
        const year = date.getFullYear(); // Obtém o ano com quatro dígitos
        return `${day}/${month}/${year}`
    }

    async getStartOfLastYear() {
        const currentYear = new Date().getFullYear();
        return new Date(currentYear - 1, 0, 1); // Ano passado, mês 0 (Janeiro), dia 1
      }

    }
