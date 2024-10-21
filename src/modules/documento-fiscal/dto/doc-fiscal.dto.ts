export class DocumentoFiscalDTO {
    numero: string;              // Número da NF-e (nNF)
    serie: string;               // Série da NF-e (serie)
    dataEmissao: Date;           // Data de emissão (dhEmi)
    valorTotal: number;          // Valor total da NF-e (vNF)
    chaveNfe: string;            // Chave da NF-e (chNFe)
    xml: string;                 // XML completo da nota
    emitente: string;            // Nome do emitente (xNome emit)
    destinatario: string;        // Nome do destinatário (xNome dest)
    naturezaOperacao: string;    // Natureza da operação (natOp)
    cnpjEmitente: string;        // CNPJ do emitente (CNPJ emit)
    cnpjDestinatario: string;    // CNPJ do destinatário (CNPJ dest)
    valorProdutos: number;       // Valor total dos produtos (vProd total)
    valorICMS: number;           // Valor total do ICMS (vICMS)
    valorICMSST: number;         // Valor do ICMS Substituição Tributária (vST)
    valorIPI: number;            // Valor total do IPI (vIPI)
    valorPIS: number;            // Valor total do PIS (vPIS)
    valorCOFINS: number;         // Valor total do COFINS (vCOFINS)
    valorFrete: number;          // Valor do frete (vFrete)
    valorSeguro: number;         // Valor do seguro (vSeg)
    valorDesconto: number;       // Valor total de descontos (vDesc)
    valorOutros: number;         // Outros valores adicionais (vOutro)
    valorTotalTributos: number;  // Valor aproximado dos tributos (vTotTrib)
    valorNotaFiscal: number;     // Valor líquido da nota fiscal (vNF)

    constructor(nfeData: any) {
        // Inicializando os campos baseados nos dados da NF-e
        this.numero = nfeData.ide.nNF;
        this.serie = nfeData.ide.serie;
        this.dataEmissao = new Date(nfeData.ide.dhEmi);
        this.valorTotal = parseFloat(nfeData.total.ICMSTot.vNF);
        this.chaveNfe = nfeData.infProt.chNFe;
        this.xml = nfeData.xml;
        this.emitente = nfeData.emit.xNome;
        this.destinatario = nfeData.dest.xNome;
        this.naturezaOperacao = nfeData.ide.natOp;
        this.cnpjEmitente = nfeData.emit.CNPJ;
        this.cnpjDestinatario = nfeData.dest.CNPJ;
        this.valorProdutos = parseFloat(nfeData.total.ICMSTot.vProd);
        this.valorICMS = parseFloat(nfeData.total.ICMSTot.vICMS);
        this.valorICMSST = parseFloat(nfeData.total.ICMSTot.vST);
        this.valorIPI = parseFloat(nfeData.total.ICMSTot.vIPI);
        this.valorPIS = parseFloat(nfeData.total.ICMSTot.vPIS);
        this.valorCOFINS = parseFloat(nfeData.total.ICMSTot.vCOFINS);
        this.valorFrete = parseFloat(nfeData.total.ICMSTot.vFrete || '0');
        this.valorSeguro = parseFloat(nfeData.total.ICMSTot.vSeg || '0');
        this.valorDesconto = parseFloat(nfeData.total.ICMSTot.vDesc || '0');
        this.valorOutros = parseFloat(nfeData.total.ICMSTot.vOutro || '0');
        this.valorTotalTributos = parseFloat(nfeData.total.ICMSTot.vTotTrib);
        this.valorNotaFiscal = parseFloat(nfeData.total.ICMSTot.vNF);
    }
}
export class ItemDocumentoFiscalDTO {
    codigoProduto: string;    // Código do produto (cProd)
    descricao: string;        // Descrição do produto (xProd)
    ncm: string;              // Código NCM (NCM)
    cfop: string;             // CFOP (CFOP)
    quantidade: number;       // Quantidade (qCom)
    unidade: string;          // Unidade de medida (uCom)
    valorUnitario: number;    // Valor unitário do item (vUnCom)
    valorTotal: number;       // Valor total do item (vProd)
    valorAdicional: number;   // Valor adicional (frete, seguro, etc.)
    descricaoComplementar: string; // Descrição complementar
    valorCusto: number;       // Custo do item (vlCustoItem)
    valorDesconto: number;    // Desconto aplicado ao item (vlDescontoItem)
    valorImposto: number;     // Valor dos impostos aplicados (vlImpostoItem)
    valorLucro: number;       // Lucro do item (vlLucroItem)
    documentoFiscalId: number; // Relacionamento com DocumentoFiscal (cdDocumentoFiscal)

    constructor(itemData: any) {
        this.codigoProduto = itemData.prod.cProd;
        this.descricao = itemData.prod.xProd;
        this.ncm = itemData.prod.NCM;
        this.cfop = itemData.prod.CFOP;
        this.quantidade = parseFloat(itemData.prod.qCom);
        this.unidade = itemData.prod.uCom;
        this.valorUnitario = parseFloat(itemData.prod.vUnCom);
        this.valorTotal = parseFloat(itemData.prod.vProd);
        this.valorAdicional = parseFloat(itemData.prod.vFrete || '0'); // Usado para valores adicionais
        this.descricaoComplementar = itemData.prod.xPed || ''; // Se houver uma descrição complementar
        this.valorCusto = 0; // Esse valor será calculado e preenchido posteriormente
        this.valorDesconto = parseFloat(itemData.prod.vDesc || '0');
        this.valorImposto = parseFloat(itemData.imposto.vTotTrib || '0');
        this.valorLucro = 0; // Esse valor será calculado e preenchido posteriormente
        this.documentoFiscalId = 0; // Será atribuído posteriormente
    }
}




export class ImpostoDTO {
    icmsBaseCalculo: number;
    icmsValor: number;
    icmsSTBaseCalculo: number;
    icmsSTValor: number;
    ipiBaseCalculo: number;
    ipiValor: number;
    pisBaseCalculo: number;
    pisValor: number;
    cofinsBaseCalculo: number;
    cofinsValor: number;

    // Campos adicionais para totalização de impostos
    vlImposto: number;
    vlBaseCalculo: number;

    constructor(impostoData: any) {
        this.icmsBaseCalculo = parseFloat(impostoData.ICMS.ICMS70.vBC);
        this.icmsSTBaseCalculo = parseFloat(impostoData.ICMS.ICMS70.vBCST);
        this.icmsValor = parseFloat(impostoData.ICMS.ICMS70.vICMS);
        this.icmsSTValor = parseFloat(impostoData.ICMS.ICMS70.vICMSST);
        this.ipiBaseCalculo = parseFloat(impostoData.IPI.IPITrib.vBC);
        this.ipiValor = parseFloat(impostoData.IPI.IPITrib.vIPI);
        this.pisBaseCalculo = parseFloat(impostoData.PIS.PISAliq.vBC);
        this.pisValor = parseFloat(impostoData.PIS.PISAliq.vPIS);
        this.cofinsBaseCalculo = parseFloat(impostoData.COFINS.COFINSAliq.vBC);
        this.cofinsValor = parseFloat(impostoData.COFINS.COFINSAliq.vCOFINS);

        // Cálculo total de base e imposto
        this.vlImposto = this.icmsValor + this.icmsSTValor + this.ipiValor + this.pisValor + this.cofinsValor;
        this.vlBaseCalculo = this.icmsBaseCalculo + this.icmsSTBaseCalculo + this.ipiBaseCalculo + this.pisBaseCalculo + this.cofinsBaseCalculo;
    }
}




export class FluxoCaixaDTO {
    valorOriginal: number;       // Valor original da fatura (vOrig)
    valorDesconto: number;       // Valor de desconto aplicado (vDesc)
    valorLiquido: number;        // Valor líquido após desconto (vLiq)
    dataVencimento: Date;        // Data de vencimento da fatura (dVenc)
    numeroFatura: string;        // Número da fatura (nFat)

    // NOVO CAMPO
    documentoFiscalId: number;   // Relaciona o fluxo de caixa ao documento fiscal

    constructor(cobrancaData: any) {
        this.valorOriginal = parseFloat(cobrancaData.fat.vOrig);
        this.valorDesconto = parseFloat(cobrancaData.fat.vDesc || '0');
        this.valorLiquido = parseFloat(cobrancaData.fat.vLiq);
        this.dataVencimento = new Date(cobrancaData.dup[0].dVenc);
        this.numeroFatura = cobrancaData.fat.nFat;

        // Inicializando o documentoFiscalId posteriormente
        this.documentoFiscalId = 0; // Será atribuído após a criação do documento
    }
}


    export interface RespostaDTO {
        status_processamento: string;
        status: string;
        nota_fiscal: NotaFiscalDTO;
    }
  
  export interface NotaFiscalDTO {
    id: string;
    tipo_nota: string;
    natureza_operacao: string | null;
    regime_tributario: string;
    finalidade: string;
    serie: string;
    numero: string;
    numero_ecommerce: string;
    data_emissao: string;
    data_saida: string;
    hora_saida: string;
    cliente: ClienteDTO;
    endereco_entrega: EnderecoEntregaDTO;
    itens: ItemWrapperDTO[];
    base_icms: string;
    valor_icms: string;
    base_icms_st: string;
    valor_icms_st: string;
    valor_servicos: string;
    valor_produtos: string;
    valor_frete: string;
    valor_seguro: string;
    valor_outras: string;
    valor_ipi: string;
    valor_issqn: string;
    valor_nota: string;
    valor_desconto: string;
    valor_faturado: string;
    frete_por_conta: string;
    transportador: TransportadorDTO;
    placa: string;
    uf_placa: string;
    quantidade_volumes: string;
    especie_volumes: string;
    marca_volumes: string;
    numero_volumes: string;
    peso_bruto: string;
    peso_liquido: string;
    forma_envio: FormaEnvioDTO;
    codigo_rastreamento: string;
    url_rastreamento: string;
    condicao_pagamento: string;
    forma_pagamento: string;
    meio_pagamento: string | null;
    parcelas: ParcelaWrapperDTO[];
    id_vendedor: string | null;
    nome_vendedor: string;
    situacao: string;
    descricao_situacao: string;
    obs: string;
    marcadores: any[];
  }
  
  export interface ClienteDTO {
    nome: string;
    tipo_pessoa: string;
    cpf_cnpj: string;
    ie: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
    fone: string;
    email: string;
  }
  
  export interface EnderecoEntregaDTO {
    tipo_pessoa: string;
    cpf_cnpj: string;
    ie: string;
    endereco: string;
    numero: string;
    complemento: string;
    bairro: string;
    cep: string;
    cidade: string;
    uf: string;
    fone: string;
    nome_destinatario: string;
  }
  
  export interface ItemWrapperDTO {
    item: ItemDTO;
  }
  
  export interface ItemDTO {
    id_produto: string;
    codigo: string;
    descricao: string;
    unidade: string;
    ncm: string;
    quantidade: string;
    valor_unitario: string;
    valor_total: string;
    cfop: string;
    natureza: string | null;
  }
  
  export interface TransportadorDTO {
    nome: string;
    cpf_cnpj: string;
    ie: string;
    endereco: string;
    cidade: string;
    uf: string;
  }
  
  export interface FormaEnvioDTO {
    id: string;
    descricao: string;
  }
  
  export interface ParcelaWrapperDTO {
    parcela: ParcelaDTO;
  }
  
  export interface ParcelaDTO {
    dias: string;
    data: string;
    valor: string;
    obs: string;
    forma_pagamento: string;
    meio_pagamento: string | null;
  }
  



