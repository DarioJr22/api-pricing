import { Module } from '@nestjs/common';
import { PessoaController } from './controllers/pessoa.controller';
import { PessoaService } from './services/pessoa.service';

@Module({
  controllers: [PessoaController],
  providers: [PessoaService]
})
export class PessoaModule {}
