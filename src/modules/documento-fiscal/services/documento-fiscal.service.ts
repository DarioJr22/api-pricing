import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LINKSINTEGRATION } from 'src/modules/integracao/services/links-integracao';
import axios from "axios";
import { PessoaService } from '../../pessoa/services/pessoa.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class DocumentoFiscalService {

      constructor(
        private readonly pessoaService:PessoaService,
        @InjectQueue('erp-extract-processor') private readonly erpDataQueue: Queue){
      }


      /* 
      1 - Buscar extrair notas do erp externo quendo for um cliente tiny
      
      */

      async extrairNotas(id:number){
        await this.processarTiny(id);
      }

       async buscarListaNotasTiny(clientId:number) {
        const cliente = await this.pessoaService.findById(clientId);
        const results: any[] = [];
        const page = {
          numero_paginas: 0,
          pagina: 0
        };

        do {
          //Recover data from actual pages

          try{
            const resp = await axios.get<any>(`${LINKSINTEGRATION.TINY_GET_ALL_DOCUMENTS}/?token=${cliente[0]['apiKey']['token']['app_key']}&formato=json&pagina=${page.pagina}`)
            console.log(resp);
            //Set to next page
            page.pagina = ++resp.data.retorno.pagina
            //Get total number of pages
            page.numero_paginas = resp.data.retorno.numero_paginas
            const result = resp.data.retorno.produtos || []
            //Put results to a 
            results.push(...result)
          }catch(erro){
            return new HttpException('Erro ao buscar notas do tiny',HttpStatus.NOT_FOUND)
          }
         
        } while (page.pagina <= page.numero_paginas);
        
        return {
           client:cliente,
           data:results
          }
        }


        async buscarDetalhamentoNotaTiny(documentId:string,token:string) {

          try{
            const resp = await axios.get<any>(`${LINKSINTEGRATION.TINY_GET_DOCUMENT_DETAIL}/?token=${token}&formato=json&id=${documentId}`)
            return resp
          }catch(error){
            return new HttpException('Deu erro na chamada do detalhamento da nota no tiny',HttpStatus.BAD_REQUEST)
          }
        
       }



       private async gravarNoBanco(notaJson: any) {
        // Gravação genérica no banco
      }
    
       /*  private converterNotaTinyParaJSON(detalheNota: any) {
        // Implementação de conversão do Tiny
      }
    
      private async buscarNotasOmie(data: any) {
        // Implementação do Omie
      }
    
      private converterNotaOmieParaJSON(notaXml: string) {
        // Implementação de conversão do Omie
      }
    
      */ 

      async processarTiny(data: any) {
        // Buscar lista de notas no Tiny


        try {
         
          const nfs = await this.buscarListaNotasTiny(data);
 
           if(!(nfs instanceof HttpException) ){
             for(const nf of nfs.data){
               await this.erpDataQueue.add('erp-extract-processor', {
                 data: {
                  nf:nf,
                  token:nfs.client[0]['apiKey']['token']['app_key']
                },
                 erp: 'tiny', // Certifique-se de que o ERP esteja sendo passado corretamente
               })
             }
           }
           
         } catch (err) {
           console.error('Erro ao adicionar o job à fila:', err);
         }

       /*  const listaNotas = await this.buscarListaNotasTiny(data);

        if(!(listaNotas instanceof HttpException)){
          for (const nota of listaNotas.data) {
            console.log(nota);
            
            // Buscar detalhamento de cada nota
             const detalheNota = await this.buscarDetalhamentoNotaTiny(nota.id);
            // Converter para JSON
            const notaJson = this.converterNotaTinyParaJSON(detalheNota);
            // Gravar no banco
            await this.gravarNoBanco(notaJson); 
          }
        } */
    
       
      }
    /*
      async processarOmie(data: any) {
        // Buscar notas completas no Omie
        const notasCompletas = await this.buscarNotasOmie(data);
        
        for (const notaXml of notasCompletas) {
          // Converter XML para JSON
          const notaJson = this.converterNotaOmieParaJSON(notaXml);
          // Gravar no banco
          await this.gravarNoBanco(notaJson);
        }
      } 
*/
}
