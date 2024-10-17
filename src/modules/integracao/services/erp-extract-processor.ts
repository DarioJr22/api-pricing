import { InjectQueue, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import Bottleneck from "bottleneck";
import { Job, Queue } from "bullmq";
import { DocumentosFiscaisJobData } from "src/modules/documento-fiscal/dto/erpData";
import { DocumentoFiscalService } from "src/modules/documento-fiscal/services/documento-fiscal.service";

@Processor('erp-extract-processor')
export class ErpExtractor extends WorkerHost{


    private readonly logger = new Logger(ErpExtractor.name);
    private limiter:Bottleneck
    
    constructor(
        private readonly  fiscalDocument:DocumentoFiscalService,
        @InjectQueue('erp-extract-processor') private readonly erpDataQueue: Queue){
        super();
        this.initializeLimiter();
    }

    initializeLimiter(){
        this.limiter = new Bottleneck({
            reservoir:30, //Número máximo de requisições disponíveis
            reservoirRefreshAmount:30, //Quantidade de requisições á ser restaurada
            reservoirRefreshInterval:60*1000,
            maxConcurrent:1,
        })
    }

    async process(job: Job<DocumentosFiscaisJobData>): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { erp, data } = job.data;
        console.log('Passou aqui');

        
       switch (erp) {
          case 'tiny':
  
           /*  // Buscar detalhamento de cada nota
             const detalheNota = await this.buscarDetalhamentoNotaTiny(nota.id);
            // Converter para JSON
            const notaJson = this.converterNotaTinyParaJSON(detalheNota);
            // Gravar no banco
            await this.gravarNoBanco(notaJson);  */
          /**/ 
          const productData = await this.limiter.schedule(()=>this.fiscalDocument.buscarDetalhamentoNotaTiny(data.nf,data.token)) 

          console.log(productData);
        
            return await this.fiscalDocument.processarTiny(data);
          case 'omie':
          //  return await this.fiscalDocument.processarOmie(data);
          default:
            throw new Error('ERP não suportado');
        }   /**/
    }
}