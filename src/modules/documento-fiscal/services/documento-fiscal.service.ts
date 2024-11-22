/* eslint-disable prefer-const */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PessoaService } from '../../pessoa/services/pessoa.service';
import { DocumentoFiscalDTO, ImpostoDTO, ItemDocumentoFiscalDTO, NotaFiscalDTO } from '../dto/doc-fiscal.dto';
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
import { TipoImposto } from '../entities/imposto.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DocumentoFiscalService {
    public readonly logger = new Logger(DocumentoFiscalService.name);
    private limiter: Bottleneck;

    constructor(
        private readonly pessoaService: PessoaService,
        @InjectQueue('extract') private readonly extractDataQueue: Queue,
        @InjectQueue('transform') private readonly transformDataQueue: Queue,
        @InjectRepository(DocumentoFiscal)
        private readonly documentoFiscalRepository: Repository<DocumentoFiscal>,
        @InjectRepository(ItemDocumentoFiscal)
        private readonly itemDocumentoFiscalRepository: Repository<ItemDocumentoFiscal>,
        @InjectRepository(ImpostoDocumentoFiscal)
        private readonly impostoDocumentoFiscalRepository: Repository<ImpostoDocumentoFiscal>,
        @InjectRepository(TipoImposto)
        private readonly tpImposto:Repository<TipoImposto>
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
    @Cron('36 09 * * 4')
    async processarTodosClientes() {
        const clientes = await this.pessoaService.findAll();
        for (const cliente of clientes) {
          await this.extractDataQueue.add('extract', {
              client: cliente,
              erp: cliente.cdErp.dsErp,
              deletebase:cliente.deletebase
          });
      }
    }

    /* BUSCAR SÓ AS NOTAS DE ENTRADAAAAAAAAA */
    async processarClienteEspecifico(cdPessoa:number,tpNota?:'E' | 'S'){
      const cliente = await this.pessoaService.findById(cdPessoa);

      if(!(cliente instanceof HttpException)){

        let param:any = {
            client: cliente [0],
            erp: cliente[0].cdErp.dsErp,
            deletebase:cliente[0].deletebase,
        }

      if(tpNota) param.tpNota = tpNota


          await this.extractDataQueue.add('extract',param );
      }
      }
    
    async getAllNfsByPessoaErp(idPessoa:any){
      try{
        return await this.documentoFiscalRepository.find({where:{
          cdPessoa:idPessoa,
        },
        relations:['cdErp']
        })
      }catch(erro){
        this.logger.log("ERRO" + erro)
        return new HttpException("Erro ao buscar a pessoa",HttpStatus.NOT_FOUND)
      }
    }

    async getItemsByPessoa(idPessoa:any){
      try{

     
  
        return await this.itemDocumentoFiscalRepository
        .createQueryBuilder('itemDocumentoFiscal')
        .leftJoinAndSelect('itemDocumentoFiscal.cdDocumentoFiscal', 'documentoFiscal')
        .where('documentoFiscal.cdPessoa = :idPessoa', { idPessoa })
        .getMany();
      }catch(erro){
        this.logger.log("ERRO" + erro)
        return new HttpException("Erro ao buscar a items",HttpStatus.NOT_FOUND)
      }
    }

    async getImpostoByPessoa(idPessoa:any){
      try{  
        return await this.impostoDocumentoFiscalRepository
        .createQueryBuilder('ImpostoDocumentoFiscal')
        .leftJoinAndSelect('ImpostoDocumentoFiscal.cdItemDocumentoFiscal', 'itemDocumentoFiscal')
        .leftJoinAndSelect('itemDocumentoFiscal.cdDocumentoFiscal', 'documentoFiscal')
        .leftJoinAndSelect('ImpostoDocumentoFiscal.cdImposto', 'imposto')
        .where('documentoFiscal.cdPessoa = :idPessoa', { idPessoa })
        .getMany();
      }catch(erro){
        this.logger.log("ERRO" + erro)
        return new HttpException("Erro ao buscar a pessoa",HttpStatus.NOT_FOUND)
      }
    }

    async getNfByProductCode(cProd:any){
      try{
        return await this.itemDocumentoFiscalRepository.find({
          where:{
            cProd:cProd
          },
          relations:['cdDocumentoFiscal']
        })
      }catch(erro){
        this.logger.log("Erro" + erro)
        return new HttpException("Erro ao buscar a pessoa",HttpStatus.NOT_FOUND)
      }
    }


    //nf/process-client/:id/:tpNf


    // Processar notas do Tiny com controle de requisições
    async extractNotasTiny(cliente: Pessoa,tpNota?:'E' | 'S') {
    
        this.logger.log(`Params:${cliente.nmPessoa}, 
            ${await this.getFormatDate(await this.getStartOfLastYear())},
            ${await this.getFormatDate()},
            ${ this.limiter}`)

            let notasTiny:any = []

            //Caso queira um tipo específico de nota né 
            if (tpNota) {
              notasTiny = await this.limiter.schedule(async () => 
                await this.buscarListaNotasTiny(cliente,
                await this.getFormatDate(await this.getStartOfLastYear()), //Pegar data de inicio do ano passado
                await this.getFormatDate(), //Pegar data de hojer
                tpNota
                ));
            }else{
               notasTiny = await this.limiter.schedule(async () => 
                await this.buscarListaNotasTiny(cliente,
                await this.getFormatDate(await this.getStartOfLastYear()), //Pegar data de inicio do ano passado
                await this.getFormatDate(),
                ));
            }

       
        for (const nota of notasTiny.data) {  

          
          this.logger.log(`Iniciando processo de transformação Tiny ${notasTiny.data.indexOf(nota)} de ${notasTiny.data.length} `)
            
          this.limiter.schedule(async ()=>       
            await this.transformDataQueue.add('transform-tiny',{
                erp:'Tiny',
                data:nota,
                cliente:cliente,
                token:notasTiny.client['apiKey']['token']['app_key']
            }))
           
        }
    }

    async transformNotasTiny(nota:any,token:string,cliente:Pessoa){


        const detalheNota:{retorno: NotaFiscalDTO} =  await this.buscarDetalhamentoNotaTiny(nota.nota_fiscal.id, token);
       
            const documentoFiscalDTO = new DocumentoFiscalDTO(detalheNota,cliente);
        
            const itensDTO:ItemDocumentoFiscalDTO[] = []
        
            const impostosDTO:ImpostoDTO[] = []
        
            const itemNf = detalheNota.retorno.xml_nfe[0].nfeProc[0].NFe[0].infNFe[0].det
            const tpImposto = await this.getTpImpoto();
            async function processItemsNf(item,calculo:any){
                itensDTO.push(new ItemDocumentoFiscalDTO(detalheNota,item))
                Object.keys(calculo).forEach((imposto) => {impostosDTO.push(new ImpostoDTO(calculo[imposto]))})
                
            }

            for( const item of itemNf){
                await processItemsNf(item,await this.totalImposto(item.imposto[0],tpImposto,'Tiny'))
            }

            return {
                nota:documentoFiscalDTO,
                item:itensDTO,
                imposto:impostosDTO,
                erp:'Tiny'
            }
    }

     // Método para buscar a lista de notas no Tiny
     async buscarListaNotasTiny(
        client:Pessoa, 
        dataInicial:string, 
        dataFinal:string,
        tpNota?:'E' | 'S'
      ) {
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

                let params:any = {
                    token: token,
                    formato: 'json',
                    pagina: page.pagina,
                    dataInicial:dataInicial,
                    dataFinal: dataFinal
                  }

                  tpNota ? params.tipoNota = tpNota : ''
                  
                  
                    const result = await limiter.schedule(() =>
                        axios.get(`${LINKSINTEGRATION.TINY_GET_ALL_DOCUMENTS}`, {
                            params:params,
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
                    axios.get(`${LINKSINTEGRATION.TINY_GET_DOCUMENT_DETAIL}`, {
                        params: {
                            token: token,
                            id: id,
                        }
                    })
                );
                console.log(`Busca da nota ${id}`);
                console.log(response.data);
                console.log(await parseStringPromise(response.data));
                return await parseStringPromise(response.data)
            } catch (error) {
                console.log(error)
                throw new HttpException('Erro ao buscar detalhamento da nota no Tiny', HttpStatus.BAD_GATEWAY);
            }
        }

       return await getNfDetailTiny(documentId);
    }

    
     // Processar notas do Omie com controle de requisições e conversão de XML
     async extractNotasOmie(cliente: Pessoa,metodo:string) {
        const notasOmie = await this.limiter.schedule(() => this.buscarNotasOmie(cliente.cdPessoa,metodo));
        
        //Transform
        for (const xmlNota of notasOmie) {
            
            this.logger.log(`Processando Notas ${notasOmie.indexOf(xmlNota)} de ${notasOmie.length}`)

            const notaJson = await this.xmlToJson(await this.xmlDecoderOmie(xmlNota.cXml)); // Converter XML para JSON aqui

            const documentoFiscalDTO = new DocumentoFiscalDTO(notaJson,cliente);

            const itensDTO:ItemDocumentoFiscalDTO[] = []
        
            const impostosDTO:ImpostoDTO[] = []

            const itemNf = Array.isArray(notaJson.nfeProc.NFe.infNFe.det) ? notaJson.nfeProc.NFe.infNFe.det : [notaJson.nfeProc.NFe.infNFe.det]

            const tpImposto = await this.getTpImpoto();
            
            async function processItemsNf(item,calculo:any){
                itensDTO.push(new ItemDocumentoFiscalDTO(notaJson,item))
                Object.keys(calculo).forEach((imposto) => {impostosDTO.push(new ImpostoDTO(calculo[imposto]))})
                
            }
            
            for( const item of itemNf){
                await processItemsNf(item,await this.totalImposto(item.imposto,tpImposto,'Tiny'))
            }
        
            await this.loadData(documentoFiscalDTO, itensDTO, impostosDTO);  
            
        }
    }

    async xmlDecoderOmie(string){
     
      //-----------------------------------------+
      // - Decodificação da string             - | 
      //-----------------------------------------+
           
        const decodedxml = string    
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, "\"")
                .replace(/&amp;/g, "&");     
        return decodedxml
      }
      

    
    async buscarNotasOmie(clientId: number,metodo:string) {
        const cliente = await this.pessoaService.findById(clientId);
        const token = cliente[0]['apiKey']['token'];
        let page = 1
        let totalPaginas = 0
        let result = []
        const limiter = new Bottleneck({
            reservoir: 30, // Limite máximo de requisições
            reservoirRefreshAmount: 30,
            reservoirRefreshInterval: 60 * 1000, // 1 minuto
            maxConcurrent: 1,
        });

        do{
            try {
                 const req = await limiter.schedule(() =>
                    axios.post<any>(
                        LINKSINTEGRATION.OMIE_GET_DOCUMENT,
                        {
                            app_key: token.app_key,
                            app_secret:token.app_secret,
                            call: metodo,
                            param: [{              
                                "nPagina": page,
                                "nRegPorPagina": 500,
                                "cModelo":"55",
                                "cOperacao":"0"
                            }],
                        },{
                            headers:{
                                'Content-Type':'application/json',
                                'Accept':'application/json'
                            }
                        }
                    )
                );

                result.push(...req.data.documentosEncontrados)

                totalPaginas = req.data.nTotPaginas
                
                console.log(`Processando Notas página ${page} de ${totalPaginas}`);
               
                page++

            } catch (erro) {
                throw new HttpException('Erro ao buscar notas no Omie', HttpStatus.BAD_GATEWAY);
            }
        }while(page <= totalPaginas)

        return result;
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

       async loadData(
        documentoFiscalDTO: DocumentoFiscalDTO,
        itensDTO: ItemDocumentoFiscalDTO[],
        impostosDTO?: ImpostoDTO[]
    ) {
         // Carregamento dos dados no banco de dados
        // Simulação de persistência no banco
        // Gravação do documento fiscal
        const docSave = await this.documentoFiscalRepository.create(documentoFiscalDTO);
        const documentoFiscal = await this.documentoFiscalRepository.save(docSave);
    
        // Processa cada item do DTO e salva no banco de dados
        for (const itemDTO of itensDTO) {
            // Transformando o DTO em uma entidade ItemDocumentoFiscal
            const item = new ItemDocumentoFiscal();
            item.cdDocumentoFiscal = documentoFiscal;
            Object.assign(item,itemDTO)
            
            // Esse valor pode ser calculado
    
            // Salvando o item no banco de dados
            const itemSalvo = await this.itemDocumentoFiscalRepository.save(item);
    
            // Gravação dos impostos do item
            for (const impostoDTO of impostosDTO) {
                const impostoDocumentoFiscal = new ImpostoDocumentoFiscal();
                impostoDocumentoFiscal.cdItemDocumentoFiscal = itemSalvo;
                impostoDocumentoFiscal.vlImposto = impostoDTO.vlImposto;
                impostoDocumentoFiscal.cdImposto = impostoDTO.cdImposto;
                await this.impostoDocumentoFiscalRepository.save(impostoDocumentoFiscal);
            }
        }

    }

    // Load

    //Utils
    async getFormatDate(dt?:Date){
        const date = dt ? dt : new Date();
        const day = date.getDate().toString().padStart(2, '0'); // Obtém o dia com dois dígitos
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Obtém o mês com dois dígitos (lembrando de adicionar 1)
        const year = date.getFullYear(); // Obtém o ano com quatro dígitos
        return `${day}/${month}/${year}`
    }

    async getStartOfLastYear() {
        const currentYear = new Date().getFullYear();
        return new Date(currentYear, 0, 1); // Ano passado, mês 0 (Janeiro), dia 1
    }   

    async handleXml(xmlString){
        return await parseStringPromise(xmlString);
    }

// Tabela de impostos para referência de tipo e categoria
 tabelaImpostos = {
    ICMS: { cdImposto: 1, dsImposto: "Estadual" },
    IPI: { cdImposto: 2, dsImposto: "Federal" },
    PIS: { cdImposto: 3, dsImposto: "Federal" },
    COFINS: { cdImposto: 4, dsImposto: "Federal" },
    ISS: { cdImposto: 5, dsImposto: "Municipal" },
    II: { cdImposto: 6, dsImposto: "Federal" },
    FCP: { cdImposto: 7, dsImposto: "Estadual" },
    "ICMS-ST": { cdImposto: 8, dsImposto: "Estadual" },
  };

  async getTpImpoto(){
    return this.tpImposto.find()
  }
  
  // Função recursiva para extrair e somar valores dos impostos
   // Função de cálculo adaptada
async calcularTotais(impostoData, tabelaImpostos) {
    const totais = {};

    
  function normalizarImposto(tipoImposto) {
    return tipoImposto === "ICMSST" ? "ICMS-ST" : tipoImposto;
  }

    // Função para encontrar o tipo de imposto na lista de TipoImposto
    function encontrarTipoImposto(impostoNome, tabela) {
        return tabela.find((imposto) => imposto.dsImposto === impostoNome) || null;
    }
  
    function somaValores(obj) {
      if (Array.isArray(obj)) {
        obj.forEach(somaValores);
      } else if (typeof obj === "object" && obj !== null) {
        for (const chave in obj) {
          if (chave.startsWith("v")) {
            const tipoImpostoNome = normalizarImposto(chave.slice(1)); // Ex.: ICMS, IPI, etc.
            const valor = parseFloat(obj[chave][0] || 0);
  
            const tipoImposto = encontrarTipoImposto(tipoImpostoNome, tabelaImpostos);
            if (tipoImposto) {
              if (!totais[tipoImpostoNome]) {
                totais[tipoImpostoNome] = {
                  cdImposto: tipoImposto.cdImposto,
                  dsImposto: tipoImposto.dsImposto,
                  tpImposto: tipoImposto.tpImposto,
                  vlImposto: 0
                };
              }
              totais[tipoImpostoNome].vlImposto += valor;
            }
          } else {
            somaValores(obj[chave]); // Continuar a busca recursiva
          }
        }
      }
    }
  
    somaValores(impostoData);
    return totais;
  }


  async  calcularTotaisDoi(impostoData: any, tabelaImpostos: any[]) {
    const totais: { [key: string]: ImpostoDTO } = {};
  
    function normalizarImposto(tipoImposto: string) {
      const mapping: { [key: string]: string } = {
        ICMSST: 'ICMS-ST',
        vTotTrib: 'TotalTributos',
        // Adicione outros mapeamentos se necessário
      };
      return mapping[tipoImposto] || tipoImposto;
    }
  
    // Função para encontrar o tipo de imposto na tabela de impostos
    function encontrarTipoImposto(impostoNome: string, tabela: any[]) {
      return tabela.find((imposto) => imposto.dsImposto === impostoNome) || null;
    }
  
    function somaValores(obj: any) {
      if (Array.isArray(obj)) {
        obj.forEach(somaValores);
      } else if (typeof obj === 'object' && obj !== null) {
        for (const chave in obj) {
          if (chave.startsWith('v')) {
            const tipoImpostoNome = normalizarImposto(chave);
            const valorStr = obj[chave];
            const valor = parseFloat(Array.isArray(valorStr) ? valorStr[0] : valorStr) || 0;
  
            const tipoImposto = encontrarTipoImposto(tipoImpostoNome, tabelaImpostos);
            if (tipoImposto) {
              if (!totais[tipoImpostoNome]) {
                totais[tipoImpostoNome] = new ImpostoDTO({
                  cdImposto: tipoImposto.cdImposto,
                  dsImposto: tipoImposto.dsImposto,
                  tpImposto: tipoImposto.tpImposto,
                  vlImposto: 0,
                });
              }
              totais[tipoImpostoNome].vlImposto += valor;
            }
          } else {
            somaValores(obj[chave]); // Continuar a busca recursiva
          }
        }
      }
    }
  
    somaValores(impostoData);
    return Object.values(totais);
  }
  
  
  // Chamando a função

  async totalImposto(nfValue,impostos, erp:'Tiny' | 'Omie'){
    return erp == 'Tiny' ? await this.calcularTotais(nfValue,impostos) : await this.calcularTotaisDoi(nfValue,impostos) 
  }



  async limparSchema(){
    this.documentoFiscalRepository.query('TRUNCATE TABLE "documento_fiscal" CASCADE');
    this.itemDocumentoFiscalRepository.query('TRUNCATE TABLE "item_documento_fiscal" CASCADE');
    this.impostoDocumentoFiscalRepository.query('TRUNCATE TABLE "imposto_documento_fiscal" CASCADE');
  }



    }
