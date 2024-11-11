import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DocumentoFiscalService } from '../../documento-fiscal/services/documento-fiscal.service';

@Injectable()
export class TaskService {

    constructor( private documentoFiscalService:DocumentoFiscalService) {}

  @Cron('48 22 * * 1')
  async processAllNfsETL(){
    await this.documentoFiscalService.processarTodosClientes()
    console.log('Processamento iniciado !')
}
    
}
