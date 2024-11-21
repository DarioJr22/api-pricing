import { Controller, Get, Param } from '@nestjs/common';
import { DocumentoFiscalService } from '../services/documento-fiscal.service';

@Controller('documento-fiscal')
export class DocumentoFiscalController {

/* Assim que terminar o recolhimento dos dados verificar esse endpoint funcionamento */
    constructor(private documentoFiscalService:DocumentoFiscalService){}

    @Get('nfs/:id')
    async getNfsByPessoa(@Param('id') cdPessoa:string){
        return this.documentoFiscalService.getAllNfsByPessoaErp(cdPessoa)
    }

    
    @Get('nf/item/:id')
    async getNfByItem(@Param('id') cdItem:string){
        return this.documentoFiscalService.getNfByProductCode(cdItem)
    }

    @Get('nf/client/:id')
    async processClient(@Param('id') cdItem:string){
        return this.documentoFiscalService.getNfByProductCode(cdItem)
    }

    


   
}
