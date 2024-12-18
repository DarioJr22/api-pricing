import { Processor, WorkerHost, InjectQueue, OnWorkerEvent } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PessoaService } from 'src/modules/pessoa/services/pessoa.service';
import { DocumentoFiscalService } from 'src/modules/documento-fiscal/services/documento-fiscal.service';
import { ExtractDTO } from 'src/modules/documento-fiscal/dto/erp-data';


@Processor('extract')
@Injectable()
export class ExtractProcessor extends WorkerHost{


    private readonly logger = new Logger(ExtractProcessor.name);

    constructor(
        private readonly pessoaService: PessoaService,
        private readonly documentoFiscalService: DocumentoFiscalService,
        @InjectQueue('extract') private readonly transformQueue: Queue,
      ) {
        super();
      }

    @OnWorkerEvent('active')
    onActive(job: Job) {
        this.logger.log(
        `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
    }

        @OnWorkerEvent('progress')
        onProgress(job: Job) {
        const { id, name, progress } = job;
        this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
        }


    async deleteDatabase(deletebase:string){
      if(deletebase == 'S') {await this.documentoFiscalService.limparSchema()}
    }
    
    async process(job: Job<ExtractDTO>): Promise<any> {
        
        const {client, erp,deletebase,tpNota}  = job.data;
        this.deleteDatabase(deletebase)

        try {
            this.logger.log(`Iniciando extração para o cliente ${client} e ERP ${erp}`);
           if (erp === 'Tiny') {
            tpNota ? await this.documentoFiscalService.extractNotasTiny(client,tpNota) : await this.documentoFiscalService.extractNotasTiny(client);
            }  else if (erp === 'Omie') {
                const tpNotaOmie = tpNota == 'E' ? '0' : '1' 
                await this.documentoFiscalService.extractNotasOmie(client,'ListarDocumentos',tpNotaOmie);
            } else {
                throw new Error('ERP não suportado');
            }
    
           // await this.transformQueue.add('transform-job', { client, extractedData });
            this.logger.log(`Extração concluída e adicionada à fila de transformação para cliente ${client}`);
          } catch (error) {
            this.logger.error(`Erro ao extrair dados do cliente ${client}: ${error.message}`);
            throw error;
          }


    }
    

}