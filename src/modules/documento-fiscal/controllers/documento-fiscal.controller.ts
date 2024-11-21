import { Controller, Get, Param } from '@nestjs/common';
import { DocumentoFiscalService } from '../services/documento-fiscal.service';

@Controller('documento-fiscal')
export class DocumentoFiscalController {

/* Assim que terminar o recolhimento dos dados verificar esse endpoint funcionamento */
    constructor(private DocumentoFiscalService:DocumentoFiscalService){}

    @Get('nfs/:id')
    async getNfsByPessoa(@Param('id') cdPessoa:string){
        return this.DocumentoFiscalService.getAllNfsByPessoaErp(cdPessoa)
    }

    
    @Get('nf/item/:id')
    async getNfByItem(@Param('id') cdItem:string){
        return this.DocumentoFiscalService.getNfByProductCode(cdItem)
    }

    @Get('nf/client/:id')
    async processClient(@Param('id') cdItem:string){
        return this.DocumentoFiscalService.getNfByProductCode(cdItem)
    }

    


   
}
