import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegimeTributario } from '../entities/regime-tributario.entity';
import { Repository } from 'typeorm';
import { CreateRegimeTributarioDto } from '../dto/create-regime-tributario.dto';

@Injectable()
export class RegimeTributarioService {

    constructor(
        @InjectRepository(RegimeTributario)
        private readonly regimeRepository:Repository<RegimeTributario>
    ){

    }

    async create(create:CreateRegimeTributarioDto){
      const novo = this.regimeRepository.create(create);
      return this.regimeRepository.save(novo);  
    }

}
