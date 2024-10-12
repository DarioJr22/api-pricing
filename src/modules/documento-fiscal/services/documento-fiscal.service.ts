import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentoFiscalService {
/* 
      private async buscarListaNotasTiny(data: any) {
        // Implementação do Tiny
      }
    
      private async buscarDetalhamentoNotaTiny(notaId: string) {
        // Implementação do Tiny
      }
    
      private converterNotaTinyParaJSON(detalheNota: any) {
        // Implementação de conversão do Tiny
      }
    
      private async buscarNotasOmie(data: any) {
        // Implementação do Omie
      }
    
      private converterNotaOmieParaJSON(notaXml: string) {
        // Implementação de conversão do Omie
      }
    
      private async gravarNoBanco(notaJson: any) {
        // Gravação genérica no banco
      }

      async processarTiny(data: any) {
        // Buscar lista de notas no Tiny
        const listaNotas = await this.buscarListaNotasTiny(data);
    
        for (const nota of listaNotas) {
          // Buscar detalhamento de cada nota
          const detalheNota = await this.buscarDetalhamentoNotaTiny(nota.id);
          // Converter para JSON
          const notaJson = this.converterNotaTinyParaJSON(detalheNota);
          // Gravar no banco
          await this.gravarNoBanco(notaJson);
        }
      }
    
      async processarOmie(data: any) {
        // Buscar notas completas no Omie
        const notasCompletas = await this.buscarNotasOmie(data);
        
        for (const notaXml of notasCompletas) {
          // Converter XML para JSON
          const notaJson = this.converterNotaOmieParaJSON(notaXml);
          // Gravar no banco
          await this.gravarNoBanco(notaJson);
        }
      } */

}
