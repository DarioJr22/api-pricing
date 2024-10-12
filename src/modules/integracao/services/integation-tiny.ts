
export interface ERPIntegrationTiny {
    baseUrl:string
    prepareRequisition():string
    getAllData(
        appKey:string,
        appSecret:string,
        param:any[]
    );
    processData()
    calculateFieldsBeforeSave()
    saveAllDocument();
}
