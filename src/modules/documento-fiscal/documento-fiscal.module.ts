import { Module } from '@nestjs/common';
import { DocumentoFiscalController } from './controllers/documento-fiscal.controller';
import { DocumentoFiscalService } from './services/documento-fiscal.service';

@Module({
  controllers: [DocumentoFiscalController],
  providers: [DocumentoFiscalService]
})
export class DocumentoFiscalModule {
  
}
