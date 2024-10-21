import { Pessoa } from "src/modules/pessoa/entities/pessoa.entity";

export interface ExtractDTO {
    erp: 'tiny' | 'omie'; // Define os ERPs suportados
    client: Pessoa; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
  }
export interface TransformtDTO {
    erp: 'tiny' | 'omie'; // Define os ERPs suportados
    data: any; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
  }
export interface LoadDTO {
    erp: 'tiny' | 'omie'; // Define os ERPs suportados
    data: any; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
  }
