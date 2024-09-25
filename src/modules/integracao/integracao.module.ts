import { IntegracaoService } from './services/integration.service';
import { Module } from '@nestjs/common';
import { IntegracaoController } from './controllers/integracao.controller';

import { OmieService } from './services/omie.service';

@Module({
  controllers: [IntegracaoController],
  providers: [IntegracaoService, OmieService]
})
export class IntegracaoModule {}
