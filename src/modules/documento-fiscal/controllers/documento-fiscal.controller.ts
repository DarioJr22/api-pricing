import { Controller, Get } from '@nestjs/common';
import { DocumentoFiscalService } from '../services/documento-fiscal.service';

@Controller('documento-fiscal')
export class DocumentoFiscalController {


    constructor(private documentoFiscalService:DocumentoFiscalService){

    }
    @Get('nfe')
    buscarnotas(){


        this.documentoFiscalService.extrairNotas(3)
        return {
            retorno:'Deu certo !'
        }
    }
}
