import { OmieReqConfig } from "./omie.service";

export interface ERPIntegrationOmie {
    baseUrl:string
    prepareRequisition(
        call:string,
        appKey:string,
        appSecret:string,
        param:any[]
    ):OmieReqConfig
    getAllData(
        appKey:string,
        appSecret:string,
        param:any[]
    );
    processData()
    calculateFieldsBeforeSave()
    saveAllDocument();
}
