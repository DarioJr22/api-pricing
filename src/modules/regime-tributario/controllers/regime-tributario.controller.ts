import { Body, Controller, Post } from '@nestjs/common';
import { RegimeTributarioService } from '../services/regime-tributario.service';
import { CreateRegimeTributarioDto } from '../dto/create-regime-tributario.dto';
import { RegimeTributario } from '../entities/regime-tributario.entity';


@Controller('regime-tributario')
export class RegimeTributarioController {
   
   
  constructor(
    private readonly regimeService: RegimeTributarioService) {}

   
    @Post()
    async create(@Body() createRegimeDto: CreateRegimeTributarioDto): Promise<RegimeTributario> {
        const newRegime = await this.regimeService.create(createRegimeDto);
        return newRegime;
    }
}
