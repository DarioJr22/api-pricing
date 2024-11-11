import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegracaoController } from './controllers/integracao.controller';
import { IntegracaoService } from './services/integration.service';
import { ERP } from './entity/erp.entity';
import { DocumentoFiscalModule } from '../documento-fiscal/documento-fiscal.module';

@Module({
  imports: [
   
    TypeOrmModule.forFeature([ERP]),
    forwardRef(()=>DocumentoFiscalModule) ,
  ],
  controllers: [IntegracaoController],
  providers: [IntegracaoService],

})
export class IntegracaoModule {}
