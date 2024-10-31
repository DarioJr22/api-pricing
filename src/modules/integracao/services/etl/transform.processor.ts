import { Processor, WorkerHost, OnWorkerEvent, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { PessoaService } from 'src/modules/pessoa/services/pessoa.service';
import { DocumentoFiscalService } from 'src/modules/documento-fiscal/services/documento-fiscal.service';
import { TransformtDTO } from 'src/modules/documento-fiscal/dto/erp-data';


@Processor('transform')
@Injectable()
export class TransformProcessor extends WorkerHost{


    private readonly logger = new Logger(TransformProcessor.name);

    constructor(
        private readonly pessoaService: PessoaService,
        private readonly documentoFiscalService: DocumentoFiscalService,
        @InjectQueue('load') private readonly loadQueueformQueue: Queue,
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

    async process(job: Job<TransformtDTO>): Promise<any> {
        
        const {token,data,cliente, erp}  = job.data;

        try {
            this.logger.log(`Iniciando extração para o cliente ${data} e ERP ${erp}`);
            /* const TransformedData = */ 

            if (erp === 'Tiny') {
                const {nota,item,imposto} = await this.documentoFiscalService.transformNotasTiny(data,token,cliente);
               await this.loadQueueformQueue.add('load-df-tiny',{
                nota:nota,
                item:item,
                imposto:imposto,
                erp:erp
               })    

               /* Quando chegar amnha, inicialize o wsl, Volte pra o fluxo de funcionamento 
               do dto de item de documento fiscais  */
            
            } /* else if (erp === 'omie') {
                await this.processarNotasOmie(cliente);
            } else {
                throw new Error('ERP não suportado');
            }*/ 
    
           // await this.transformQueue.add('transform-job', { client, TransformedData });
            this.logger.log(`Extração concluída e adicionada à fila de transformação para cliente ${data}`);
          } catch (error) {
            this.logger.error(`Erro ao extrair dados do cliente ${data}: ${error.message}`);
            throw error;
          }


    }
    

}