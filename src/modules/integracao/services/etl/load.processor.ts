import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PessoaService } from 'src/modules/pessoa/services/pessoa.service';
import { DocumentoFiscalService } from 'src/modules/documento-fiscal/services/documento-fiscal.service';
import { LoadDTO } from 'src/modules/documento-fiscal/dto/erp-data';


@Processor('load')
@Injectable()
export class LoadProcessor extends WorkerHost{


    private readonly logger = new Logger(LoadProcessor.name);

    constructor(
        private readonly pessoaService: PessoaService,
        private readonly documentoFiscalService: DocumentoFiscalService,
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

    async process(job: Job<LoadDTO>): Promise<any> {
        
        const {nota,item,imposto,erp}  = job.data;

        try {
           
            if (erp === 'Tiny') {
                 await this.documentoFiscalService.loadData(nota,item,imposto);
                
            } /* else if (erp === 'omie') {
                await this.processarNotasOmie(cliente);
            } else {
                throw new Error('ERP não suportado');
            }*/ 
    
           // await this.transformQueue.add('transform-job', { client, TransformedData });
            this.logger.log(`Extração concluída e adicionada à fila de transformação para cliente`);
          } catch (error) {
            this.logger.error(`Erro ao extrair dados do cliente: ${error.message}`);
            throw error;
          }


    }
    

}