export interface DocumentosFiscaisJobData {
    erp: 'tiny' | 'omie'; // Define os ERPs suportados
    data: any; // Aqui poderia ser mais específico dependendo da estrutura dos dados de cada ERP
  }