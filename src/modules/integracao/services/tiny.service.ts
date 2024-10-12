import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { ERPIntegrationTiny } from './integation-tiny';
dotenv.config();
@Injectable()
export class TinyService implements ERPIntegrationTiny {

    baseUrl:string
    prepareRequisition(){
        return `token=${process.env.APIKEY}`
    }
    
    getAllData(){
        
    };

    processData(){

    };
    
    calculateFieldsBeforeSave(){

    };
    
    saveAllDocument(){

    };


}
