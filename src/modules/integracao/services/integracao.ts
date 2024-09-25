import { OmieReqConfig } from "./omie.service";

export interface ERPIntegration {

    baseUrl:string

    prepareRequisition(
        call:string,
        appKey:string,
        appSecret:string,
        param:any[]
    ):OmieReqConfig

    //Get data from other erp
    getAllData(
        appKey:string,
        appSecret:string,
        param:any[]
    );

    //Calculate fields of eac
    //In this step, we will devide what is information from the 
    //Fiscal document to other tables
    processData()

    //Get calculated fields
    calculateFieldsBeforeSave()

    //Salva tudo que foi coletado.
    saveAllDocument();

}
