import { Body, Controller, Get, Param } from '@nestjs/common';
import { DocumentoFiscalService } from '../services/documento-fiscal.service';
import { ItemDocumentoFiscal } from '../entities/item-documento-fiscal.entity';

@Controller('documento-fiscal')
export class DocumentoFiscalController {


    constructor(private DocumentoFiscalService:DocumentoFiscalService){}

    @Get('nfs/:id')
    async getNfsByPessoa(@Param('id') cdPessoa:string){
        return this.DocumentoFiscalService.getAllNfsByPessoaErp(cdPessoa)
    }

    
    @Get('nf/item/:id')
    async getNfByItem(@Param('id') cdItem:string){
        return this.DocumentoFiscalService.getNfByProductCode(cdItem)
    }


   
}
