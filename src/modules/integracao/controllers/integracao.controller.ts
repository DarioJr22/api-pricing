import { Body, Controller, Post } from '@nestjs/common';
import { CreateErpDto } from '../dto/integracao.dto';
import { ERP } from '../entity/erp.entity';
import { IntegracaoService } from '../services/integration.service';

@Controller('integracao')
export class IntegracaoController {

    constructor(
        private readonly erpService: IntegracaoService
    ){}

    @Post('erp')
    async create(@Body() createErpDto: CreateErpDto): Promise<ERP> {
      return this.erpService.create(createErpDto);
    }

}
