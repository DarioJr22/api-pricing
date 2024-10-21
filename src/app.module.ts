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
import { ExtractProcessor } from './modules/integracao/services/etl/extract/extract.processor';
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    BullModule.forRoot({
      connection:{
        host:process.env.REDIS_HOST,
        port:6379
      }
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
  providers: [AppService,DocumentoFiscalService,ExtractProcessor,PessoaService],
})
export class AppModule {}
