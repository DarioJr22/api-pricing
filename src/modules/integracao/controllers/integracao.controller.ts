import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { OmieService } from '../services/omie.service';
import { CreateErpDto } from '../dto/integracao.dto';
import { ERP } from '../entity/erp.entity';
import { IntegracaoService } from '../services/integration.service';

@Controller('integracao')
export class IntegracaoController {

    constructor(private omieService:OmieService,
        private readonly erpService: IntegracaoService
    ){}

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

    @Post('erp')
    async create(@Body() createErpDto: CreateErpDto): Promise<ERP> {
      return this.erpService.create(createErpDto);
    }

}
