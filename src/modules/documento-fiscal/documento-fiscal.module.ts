import { Module } from '@nestjs/common';
import { DocumentoFiscalController } from './controllers/documento-fiscal.controller';
import { DocumentoFiscalService } from './services/documento-fiscal.service';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaService } from '../pessoa/services/pessoa.service';
import { RegimeTributario } from '../regime-tributario/entities/regime-tributario.entity';
import { BullModule } from '@nestjs/bullmq';
import { ErpExtractor } from '../integracao/services/erp-extract-processor';

@Module({
  imports:[
    TypeOrmModule.forFeature([Pessoa]),
    TypeOrmModule.forFeature([RegimeTributario]),
    BullModule.registerQueue({
      name:'erp-extract-processor'
    })],
    
  controllers: [DocumentoFiscalController],
  providers: [DocumentoFiscalService,PessoaService,ErpExtractor]
})
export class DocumentoFiscalModule {
  
}
