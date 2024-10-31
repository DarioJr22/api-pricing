import { Pessoa } from "src/modules/pessoa/entities/pessoa.entity";
import { DocumentoFiscalDTO, ImpostoDTO, ItemDocumentoFiscalDTO } from "./doc-fiscal.dto";

export interface ExtractDTO {
    erp: 'Tiny' | 'Omie'; // Define os ERPs suportados
    client: Pessoa; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
  }
export interface TransformtDTO {
    erp: 'Tiny' | 'Omie'; // Define os ERPs suportados
    data: any; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
    token:string,
    cliente:Pessoa
  }
export interface LoadDTO {
    erp: 'Tiny' | 'Omie'; // Define os ERPs suportados
    nota: DocumentoFiscalDTO; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
    item: ItemDocumentoFiscalDTO[]; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
    imposto: ImpostoDTO[]; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
  }
