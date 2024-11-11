import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentoFiscalModule } from './modules/documento-fiscal/documento-fiscal.module';
import { PessoaModule } from './modules/pessoa/pessoa.module';
import { RegimeTributarioModule } from './modules/regime-tributario/regime-tributario.module';
import { IntegracaoModule } from './modules/integracao/integracao.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'config/typeorm.config';
import { BullModule } from '@nestjs/bullmq';
import { DocumentoFiscalService } from './modules/documento-fiscal/services/documento-fiscal.service';
import { PessoaService } from './modules/pessoa/services/pessoa.service';
import { ExtractProcessor } from './modules/integracao/services/etl/extract.processor';
import { TransformProcessor } from './modules/integracao/services/etl/transform.processor';
import { LoadProcessor } from './modules/integracao/services/etl/load.processor';
import Redis from 'ioredis';
import * as dotenv from 'dotenv';
dotenv.config()
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
      //Dev 
      /*  BullModule.forRoot({
        connection:{
          host:process.env.REDIS_HOST,
          port:6379
        }
      }) */
     //prod
      BullModule.forRoot({
        connection: new Redis(`${process.env.REDIS_URL}?family=0`,
          {
            maxRetriesPerRequest:null
          }
        ),
      }),
    BullModule.registerQueue(
      {name: 'extract'},
      {name:'transform'},
      {name:'load'}
    ),
    DocumentoFiscalModule, 
    PessoaModule, 
    RegimeTributarioModule, 
    IntegracaoModule],
  controllers: [AppController],
  providers: [
    AppService,
    DocumentoFiscalService,
    ExtractProcessor,
    TransformProcessor,
    LoadProcessor,
    PessoaService
  ],
})
export class AppModule {}
