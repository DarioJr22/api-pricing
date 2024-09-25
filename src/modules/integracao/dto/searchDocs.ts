export class SearchDocumentsDto {
    nPagina: number;                // Número da página atual
    nTotPaginas: number;            // Número total de páginas
    nRegistros: number;             // Número de registros na página atual
    nTotRegistros: number;          // Número total de registros encontrados
    documentosEncontrados: DocumentoEncontradoDto[];  // Lista de documentos encontrados
  }
  


  export class DocumentoEncontradoDto {
    cSerie: string;               // Série do documento
    cStatus: string;              // Status do documento
    cXml: string;                 // XML do documento
    dEmissao: string;             // Data de emissão (dd/MM/yyyy)
    hEmissao: string;             // Hora de emissão
    nChave: string;               // Chave de acesso da nota fiscal
    nIdNF: number;                // ID da nota fiscal
    nIdReceb: number;             // ID de recebimento
    nNumero: number;              // Número da nota fiscal
    nValor: number;               // Valor da nota fiscal
  }
  