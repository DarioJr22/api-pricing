import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DocumentoFiscalService } from './modules/documento-fiscal/services/documento-fiscal.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private documentoFiscalService:DocumentoFiscalService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  

  @Get('nfe')
  buscarnotas(){
      this.documentoFiscalService.processarTodosClientes()
      return {
          retorno:'Deu certo !'
      }
  }
}
