import { IntegracaoService } from './services/integration.service';
import { Module } from '@nestjs/common';
import { IntegracaoController } from './controllers/integracao.controller';

import { OmieService } from './services/omie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ERP } from './entity/erp.entity';

@Module({
  imports:[TypeOrmModule.forFeature([ERP])],
  controllers: [IntegracaoController],
  providers: [IntegracaoService, OmieService]
})
export class IntegracaoModule {}
