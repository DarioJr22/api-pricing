export class CreateDocumentoFiscalDTO {
    nrDocumento: string;           // Número do Documento Fiscal
    nrSerie: string;               // Série do Documento Fiscal
    dtEmissao: Date;               // Data de emissão do documento fiscal
    vlTotal: number;               // Valor total do documento
    xml: string;                   // XML da nota fiscal eletrônica (NFe)
    dsModeloFiscal: string;        // Modelo do documento fiscal (Ex: 55 - NFe)
    dsChaveNfe: string;            // Chave da NFe (Nota Fiscal Eletrônica)
    dtEntSai: Date;                // Data de entrada ou saída
    indTransac: string;            // Indicador de transação (Entrada ou Saída)
    vlRecuperavel: number;         // Valor recuperável (créditos de impostos)
    vlNRecuperavel: number;        // Valor não recuperável
    vlFrete: number;               // Valor do frete
    vlSeguro: number;              // Valor do seguro
  
    cdPessoa: number;              // ID da Pessoa associada ao documento (FK)
    cdErp: number;                 // ID do ERP responsável pelo documento (FK)
  
    vlReceitaBruta: number;        // Receita bruta
    vlReceitaLiquida: number;      // Receita líquida
    vlDesconto: number;            // Valor de desconto
    vlCustoProduto: number;        // Custo total dos produtos
    vlLucroBruto: number;          // Lucro bruto
    vlLucroLiquido: number;        // Lucro líquido
    vlDespesasOperacionais: number;// Despesas operacionais
    vlImpostosTotais: number;      // Impostos totais
  
    itens: CreateItemDocumentoFiscalDTO[]; // Lista de itens do documento fiscal
  }

  export class CreateItemDocumentoFiscalDTO {
    vlItem: number;                // Valor do item
    dsComplementar: string;        // Descrição complementar do item
    vlAdicional: number;           // Valor adicional do item
    dsProdutoServico: string;      // Descrição do produto ou serviço
    cdProdutoServico: string;      // Código do produto ou serviço
  
    vlCustoItem: number;           // Custo do item
    vlDescontoItem: number;        // Valor do desconto aplicado ao item
    vlImpostoItem: number;         // Valor do imposto sobre o item
    vlLucroItem: number;           // Lucro gerado pelo item
  
    // Opcional: Outros dados podem ser adicionados conforme necessário.
  }
  
  