import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Pessoa } from '../entities/pessoa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegimeTributario } from 'src/modules/regime-tributario/entities/regime-tributario.entity';
import { CreatePessoaDto } from '../dto/create-pessoa.dto';

@Injectable()
export class PessoaService {
    constructor(
        @InjectRepository(Pessoa)
        private readonly pessoaRepository:Repository<Pessoa>,
        
        @InjectRepository(RegimeTributario)
        private readonly regimeRepository: Repository<RegimeTributario>){}


    async findById(id:number){
      try{
        return await this.pessoaRepository.find({
          where:{
            cdPessoa:id
          },
          relations:['cdErp']
        })
      }catch(erro){
        return new HttpException("Erro ao buscar a pessoa",HttpStatus.NOT_FOUND);
      }
    }

    //Pense em bons triggers para vocÊ só registrar em um lugar e isso ser replicável FÁCIL
    async create(createPessoaDto: CreatePessoaDto) {
     // Buscar o regime tributário relacionado
     const regimeTributario = await this.regimeRepository.findOne({
        where: { cdRegimeTributario: createPessoaDto.cdRegimeTributario },
      });
  
      if (!regimeTributario) {
        throw new Error('Regime tributário não encontrado.');
      }
  
      // Criar nova entidade Pessoa
      const novaPessoa = this.pessoaRepository.create({
        ...createPessoaDto,
        cdRegimeTributario: regimeTributario,  // Relacionar o regime tributário
      });
  
      // Salvar a pessoa no banco de dados
      return this.pessoaRepository.save(novaPessoa);
      }

}
