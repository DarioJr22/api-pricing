import { Injectable } from '@nestjs/common';
import { ERPIntegrationOmie } from './integation';
import { DocumentoEncontradoDto, SearchDocumentsDto } from '../dto/searchDocs';
import axios from "axios";
export interface OmieReqConfig{
    call:string,
    app_key:string,
    app_secret:string,
    param:any[]
}


@Injectable()
export class OmieService implements ERPIntegrationOmie {
    baseUrl: string;



    prepareRequisition(
        call:string,
        appKey:string,
        appSecret:string,
        param:any[]
    ) {
        const reqConfig:OmieReqConfig = {
            "call":call,
            "app_key":appKey,
            "app_secret":appSecret,
            "param":param
        }
       
        return reqConfig
    }

     //Get data from other erp
    async getAllData(
                appKey:string,
                appSecret:string){
     
            // eslint-disable-next-line prefer-const
            let results:DocumentoEncontradoDto[] = [];
            // eslint-disable-next-line prefer-const
            let requestParams = [ 
                {
                    "nPagina": 1,
                    "nRegPorPagina": 1000,
                    "cModelo": "55",
                    "cOperacao": "0"
                }
            ]
            // eslint-disable-next-line prefer-const
            let page = {
                nTotPaginas:0,
                nPagina:0
            };
            
            
     
            do{
                   //Recover data from actual pages
                   const resp = await axios.post<SearchDocumentsDto>(`${this.baseUrl}`,
                    this.prepareRequisition("ListarDocumentos",
                    appKey,
                    appSecret,
                    requestParams
                    ))
                   
                   //Set to next page
                   page.nPagina = ++resp.data.nPagina
                   
                   //Get total number of pages
                   page.nTotPaginas = resp.data.nTotPaginas

                   const {nPagina} = page

                   requestParams[0].nPagina = nPagina

                   //Put results to a 
                   results.push(...resp.data.documentosEncontrados)   
            }while(page.nPagina <= page.nTotPaginas);
     
     
          //  results = await Promise.all(await this.iterateProductBalance(results))
            return results
         }

     //Calculate fields of eac
     //In this step, we will devide what is information from the 
     //Fiscal document to other tables
     processData(){

        //

     }
 
     //Get calculated fields
     calculateFieldsBeforeSave(){

     }
 
     //Salva tudo que foi coletado.
     saveAllDocument(){

     };
}
