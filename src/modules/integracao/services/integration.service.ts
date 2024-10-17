import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERP } from '../entity/erp.entity';
import { Repository } from 'typeorm';
import { CreateErpDto } from '../dto/integracao.dto';

@Injectable()
export class IntegracaoService {

    constructor(
        @InjectRepository(ERP)
        private erpRepository: Repository<ERP>,
      ) {}

      async create(createErpDto: CreateErpDto): Promise<ERP> {
        const erp = this.erpRepository.create(createErpDto); // cria uma instância da entidade ERP
        return await this.erpRepository.save(erp); // salva no banco de dados
      }
    
}
