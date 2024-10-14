import { Module } from '@nestjs/common';
import { PessoaController } from './controllers/pessoa.controller';
import { PessoaService } from './services/pessoa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pessoa } from './entities/pessoa.entity';
import { RegimeTributario } from '../regime-tributario/entities/regime-tributario.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Pessoa]),
  TypeOrmModule.forFeature([RegimeTributario]) ],
  controllers: [PessoaController],
  providers: [PessoaService]
})
export class PessoaModule {}
