import { Controller, Get, Param } from '@nestjs/common';
import { DocumentoFiscalService } from '../services/documento-fiscal.service';

@Controller('documento-fiscal')
export class DocumentoFiscalController {

/* Assim que terminar o recolhimento dos dados verificar esse endpoint funcionamento */
    constructor(private documentoFiscalService:DocumentoFiscalService){}

    //Recuperação de tabelas 
    @Get('nfs/:cdPessoa')
    async getNfsByPessoa(@Param('cdPessoa') cdPessoa:string){
        return this.documentoFiscalService.getAllNfsByPessoaErp(cdPessoa)
    }

    @Get('nfs/item/:cdPessoa')
    async getItemsByPessoa(@Param('cdPessoa') cdPessoa:number){
        return this.documentoFiscalService.getItemsByPessoa(cdPessoa)
    }

    @Get('nfs/imposto/:cdPessoa')
    async getImposByPessoa(@Param('cdPessoa') cdPessoa:string){
        return this.documentoFiscalService.getImpostoByPessoa(cdPessoa)
    }

    @Get('nfs')
    
    //Motores para busca customizada de dados específicos
    //Busca de uma nota por um código de produto por exemplo
    @Get('nfs/by-item/:id')
    async getNfByItem(@Param('id') cdItem:string){
        return this.documentoFiscalService.getNfByProductCode(cdItem)
    }

    //Start 
    @Get('nf/process-client/:id')
    async processClient(@Param('id') cd:number){
        return this.documentoFiscalService.processarClienteEspecifico(cd)
    }

    @Get('nf/process-client/:id/:tpNf')
    async processClientEpecific(@Param('id') cd:number,tNf?:"E" | "S"){
        return this.documentoFiscalService.processarClienteEspecifico(cd,tNf)
    }

    


   
}
