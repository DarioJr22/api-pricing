import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { OmieService } from '../services/omie.service';

@Controller('integracao')
export class IntegracaoController {

    constructor(private omieService:OmieService){}

    @Post('getAllDocuments')
    getALLDoc(@Body() credentials:{
        appkey:string,
        appSecret:string
    }){
        try {
            const {appkey,appSecret} = credentials
            const docs = this.omieService.getAllData(appkey,appSecret);
            return docs
            } catch (error) {
              throw new HttpException('Erro ao recuperar documentos', HttpStatus.INTERNAL_SERVER_ERROR);
            }
    }

}
