import { forwardRef, Module } from '@nestjs/common';
import { Pessoa } from '../pessoa/entities/pessoa.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaService } from '../pessoa/services/pessoa.service';
import { RegimeTributario } from '../regime-tributario/entities/regime-tributario.entity';
import { DocumentoFiscal } from './entities/documento-fiscal.entity';
import { ItemDocumentoFiscal } from './entities/item-documento-fiscal.entity';
import { ImpostoDocumentoFiscal } from './entities/imposto-documento-fiscal.entity';
import { FluxoCaixa } from './entities/fluxo-caixa.entity';
import { IntegracaoModule } from '../integracao/integracao.module';
import { TipoImposto } from './entities/imposto.entity';
import { DocumentoFiscalController } from './controllers/documento-fiscal.controller';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      DocumentoFiscal,
      ItemDocumentoFiscal,
      ImpostoDocumentoFiscal,
      FluxoCaixa,
      Pessoa,
      RegimeTributario,
      TipoImposto
    ]),
    forwardRef(() => IntegracaoModule), 
   ],
    
  controllers: [DocumentoFiscalController],
  providers: [PessoaService ],
  exports: [TypeOrmModule]
})
export class DocumentoFiscalModule {
  
}
