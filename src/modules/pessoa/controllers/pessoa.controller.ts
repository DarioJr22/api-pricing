import { Body, Controller, Post } from '@nestjs/common';
import { PessoaService } from '../services/pessoa.service';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';
import { Pessoa } from '../entities/pessoa.entity';

@Controller('pessoa')
export class PessoaController {


       
  constructor(
    private readonly PessoaService: PessoaService) {}

   
    @Post()
    async create(@Body() createRegimeDto: CreatePessoaDto): Promise<Pessoa> {
        return this.PessoaService.create(createRegimeDto);
    }
}
