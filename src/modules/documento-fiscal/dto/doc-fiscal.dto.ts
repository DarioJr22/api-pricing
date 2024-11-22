import { TipoImposto } from './../entities/imposto.entity';
import { ERP } from "src/modules/integracao/entity/erp.entity";
import { Pessoa } from "src/modules/pessoa/entities/pessoa.entity";
export class DocumentoFiscalDTO {
  nrDocumento: string; // Número do documento fiscal (número da NF-e)
  nrSerie: string; // Número da série da nota fiscal
  dtEmissao: Date; // Data de emissão da NF-e
  vlTotal: number; // Valor total da nota fiscal
  tpNf: string; // Tipo de Nota Fiscal ("0" para entrada, "1" para saída)
  natOp: string; // Natureza da operação (ex.: venda, devolução)
  xMotivo: string; // Descrição do motivo (ex.: cancelamento)
  xPag: string; // Forma de pagamento (ex.: boleto, cartão de crédito)
  nrIde: string; // Código de identificação da nota
  nomeCliente: string; // Nome do cliente
  lagradouroCliente: string; // Logradouro do cliente (endereço: rua, avenida, etc.)
  bairro: string; // Bairro do cliente
  cidade: string; // Cidade do cliente
  uf: string; // Unidade Federativa (estado) do cliente
  cep: string; // Código de Endereçamento Postal (CEP) do cliente
  xml: string; // Conteúdo XML da NF-e
  cdPessoa: Pessoa; // Código ou objeto que representa a pessoa associada à nota
  cdErp: ERP; // Código do sistema ERP associado
  dsChaveNfe: string; // Descrição da chave da NF-e (chave de acesso)
  dtEntSai: Date; // Data de entrada ou saída da mercadoria
  vlFrete: number; // Valor do frete
  vlSeguro: number; // Valor do seguro
  vlReceitaBruta: number; // Valor da receita bruta (antes de deduções)
  vlReceitaLiquida: number; // Valor da receita líquida (após deduções)
  vlDesconto: number; // Valor dos descontos aplicados
  vlCustoProduto: number; // Custo dos produtos envolvidos na nota
  vlLucroBruto: number; // Valor do lucro bruto
  vlLucroLiquido: number; // Valor do lucro líquido
  vlDespesasOperacionais: number; // Valor das despesas operacionais
  vlImpostosTotais: number; // Valor total dos impostos aplicados

  constructor(nfeData:any,cliente:Pessoa) {
    this.cdPessoa = cliente;
    this.cdErp = cliente.cdErp;

    let infNFe: any;
    let total: any;



    // Verifica se os dados são do Tiny ERP
    if (nfeData.retorno && nfeData.retorno.xml_nfe && nfeData.retorno.status[0] == 'OK' ) {
      // Extrai os dados do Tiny
      infNFe = nfeData.retorno.xml_nfe[0].nfeProc[0].NFe[0].infNFe[0];
      total = infNFe.total[0].ICMSTot[0];

      this.nrDocumento = infNFe.ide[0].nNF[0];
      this.nrSerie = infNFe.ide[0].serie[0];
      this.dtEmissao = new Date(infNFe.ide[0].dhEmi[0]);
      this.vlTotal = parseFloat(total.vNF[0]);
      this.tpNf = infNFe.ide[0].tpNF[0] === '1' ? 'Saída' : 'Entrada';
      this.natOp = infNFe.ide[0].natOp[0];
      this.xMotivo = nfeData.retorno.xml_nfe[0].nfeProc[0].protNFe[0].infProt[0].xMotivo[0];
      this.xPag = infNFe.pag[0].detPag[0].xPag ? infNFe.pag[0].detPag[0].xPag[0] : infNFe.pag[0].detPag[0].tPag[0];
      this.nrIde = infNFe.dest[0].CPF ? infNFe.dest[0].CPF[0] : infNFe.dest[0].CNPJ[0];
      this.nomeCliente = infNFe.dest[0].xNome[0];
      this.lagradouroCliente = `${infNFe.dest[0].enderDest[0].xLgr[0]} ${infNFe.dest[0].enderDest[0].nro[0]}`;
      this.bairro = infNFe.dest[0].enderDest[0].xBairro[0];
      this.cidade = infNFe.dest[0].enderDest[0].xMun[0];
      this.uf = infNFe.dest[0].enderDest[0].UF[0];
      this.cep = infNFe.dest[0].enderDest[0].CEP[0];
      this.xml = JSON.stringify(nfeData.retorno.xml_nfe);
      this.dsChaveNfe = nfeData.retorno.xml_nfe[0].nfeProc[0].protNFe[0].infProt[0].chNFe[0];
      this.dtEntSai = new Date(infNFe.ide[0].dhSaiEnt[0]);
      this.vlFrete = parseFloat(total.vFrete[0] || '0');
      this.vlSeguro = parseFloat(total.vSeg[0] || '0');
      this.vlReceitaBruta = parseFloat(total.vProd[0]);
      this.vlReceitaLiquida = this.vlReceitaBruta - parseFloat(total.vDesc[0] || '0');
      this.vlDesconto = parseFloat(total.vDesc[0] || '0');
      this.vlCustoProduto = this.vlReceitaLiquida; // Placeholder
      this.vlLucroBruto = this.vlReceitaBruta - this.vlCustoProduto;
      this.vlLucroLiquido = this.vlLucroBruto; // Placeholder
      this.vlDespesasOperacionais = 0; // Placeholder
      this.vlImpostosTotais = parseFloat(total.vICMS[0]) + parseFloat(total.vIPI[0] || '0') + parseFloat(total.vCOFINS[0] || '0') + parseFloat(total.vPIS[0] || '0');

    } else if (nfeData.nfeProc.NFe && nfeData.nfeProc.NFe.infNFe) {
      // Extrai os dados do Omie
      infNFe = nfeData.nfeProc.NFe.infNFe;
      total = infNFe.total.ICMSTot;

      this.nrDocumento = infNFe.ide.nNF;
      this.nrSerie = infNFe.ide.serie;
      this.dtEmissao = new Date(infNFe.ide.dhEmi);
      this.vlTotal = parseFloat(total.vNF);
      this.tpNf = infNFe.ide.tpNF === '1' ? 'Saída' : 'Entrada';
      this.natOp = infNFe.ide.natOp;
      this.xMotivo = nfeData.nfeProc.protNFe.infProt.xMotivo;
      this.xPag = infNFe.pag.detPag.xPag;
      this.nrIde = infNFe.dest.CPF ? infNFe.dest.CPF : infNFe.dest.CNPJ;
      this.nomeCliente = infNFe.dest.xNome;
      this.lagradouroCliente = `${infNFe.dest.enderDest.xLgr} ${infNFe.dest.enderDest.nro}`;
      this.bairro = infNFe.dest.enderDest.xBairro;
      this.cidade = infNFe.dest.enderDest.xMun;
      this.uf = infNFe.dest.enderDest.UF;
      this.cep = infNFe.dest.enderDest.CEP;
      this.xml = JSON.stringify(nfeData);
      this.dsChaveNfe = nfeData.nfeProc.protNFe.infProt.chNFe;
      this.dtEntSai = infNFe.ide.dhSaiEnt ? new Date(infNFe.ide.dhSaiEnt) : new Date(infNFe.ide.dhEmi); //TODO - Analisar oque é melhor pra pegar a data aqui
      this.vlFrete = parseFloat(total.vFrete || '0');
      this.vlSeguro = parseFloat(total.vSeg || '0');
      this.vlReceitaBruta = parseFloat(total.vProd);
      this.vlReceitaLiquida = this.vlReceitaBruta - parseFloat(total.vDesc || '0');
      this.vlDesconto = parseFloat(total.vDesc || '0');
      this.vlCustoProduto = this.vlReceitaLiquida; // Placeholder
      this.vlLucroBruto = this.vlReceitaBruta - this.vlCustoProduto;
      this.vlLucroLiquido = this.vlLucroBruto; // Placeholder
      this.vlDespesasOperacionais = 0; // Placeholder
      this.vlImpostosTotais = parseFloat(total.vICMS || '0') + parseFloat(total.vIPI || '0') + parseFloat(total.vCOFINS || '0') + parseFloat(total.vPIS || '0');

    } else {
      throw new Error("Formato de dados desconhecido");
    }
  }
}

//Você Parou aqui filão 

export class ItemDocumentoFiscalDTO {
  dtEmissao:string;
  nrDocumento:string;
  cProd: string;    // Código do produto (cProd)
  xProd: string;        // Descrição do produto (xProd)
  uCom: string;            
  qCom: string;            
  vUnCom: number;       //Quantidade comercial
  vProd: number;          //Valor total
   

  constructor(nf: any, itemNf: any) {
    if (nf.retorno && nf.retorno.xml_nfe) {
      // Dados do Tiny ERP
      const infNFe = nf.retorno.xml_nfe[0].nfeProc[0].NFe[0].infNFe[0];
      this.dtEmissao = `${new Date(infNFe.ide[0].dhEmi[0])}`;
      this.nrDocumento = infNFe.ide[0].nNF[0];
      this.cProd = itemNf.prod[0].cProd[0];
      this.xProd = itemNf.prod[0].xProd[0];
      this.uCom = itemNf.prod[0].uCom[0];
      this.qCom = itemNf.prod[0].qCom[0];
      this.vUnCom = parseFloat(itemNf.prod[0].vUnCom[0]);
      this.vProd = parseFloat(itemNf.prod[0].vProd[0]);
    } else if (nf.nfeProc.NFe && nf.nfeProc.NFe.infNFe) {
      // Dados do Omie
      const infNFe = nf.nfeProc.NFe.infNFe;
      this.dtEmissao = `${new Date(infNFe.ide.dhEmi)}`;
      this.nrDocumento = infNFe.ide.nNF;
      this.cProd = itemNf.prod.cProd;
      this.xProd = itemNf.prod.xProd;
      this.uCom = itemNf.prod.uCom;
      this.qCom = itemNf.prod.qCom;
      this.vUnCom = parseFloat(itemNf.prod.vUnCom);
      this.vProd = parseFloat(itemNf.prod.vProd);
    } else {
      throw new Error("Formato de dados desconhecido");
    }
  }
}




export class ImpostoDTO {
  cdImposto:TipoImposto
  vlImposto:number

    constructor(
      calculoImposto:any,) {
        Object.assign(this,calculoImposto)
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


export interface NotaFiscalDTO {
  status_processamento: string[];
  status: string[];
  xml_nfe: XmlNfe[];
}

export interface XmlNfe {
  nfeProc: NfeProc[];
}

export interface NfeProc {
  $: {
    xmlns: string;
    versao: string;
  };
  NFe: NFe[];
  protNFe: ProtNFe[];  // Adicionado 'protNFe'
}

export interface NFe {
  $: {
    xmlns: string;
  };
  infNFe: InfNFe[];
}

export interface InfNFe {
  $: {
    versao: string;
    Id: string;
  };
  ide: Ide[];
  emit: Emit[];
  dest: Dest[];
  det: Det[];
  total: Total[];
  transp: Transp[];
  pag: Pag[];
  infAdic: InfAdic[];
  compra: Compra[];
  infRespTec: InfRespTec[];
}

export interface Ide {
  cUF: string[];
  cNF: string[];
  natOp: string[];
  mod: string[];
  serie: string[];
  nNF: string[];
  dhEmi: string[];
  dhSaiEnt: string[];
  tpNF: string[];
  idDest: string[];
  cMunFG: string[];
  tpImp: string[];
  tpEmis: string[];
  cDV: string[];
  tpAmb: string[];
  finNFe: string[];
  indFinal: string[];
  indPres: string[];
  indIntermed: string[];
  procEmi: string[];
  verProc: string[];
  NFref: NFref[];
}

export interface NFref {
  refNFe: string[];
}

export interface Emit {
  CNPJ: string[];
  xNome: string[];
  xFant: string[];
  enderEmit: EnderEmit[];
  IE: string[];
  IM: string[];
  CNAE: string[];
  CRT: string[];
}

export interface EnderEmit {
  xLgr: string[];
  nro: string[];
  xBairro: string[];
  cMun: string[];
  xMun: string[];
  UF: string[];
  CEP: string[];
  cPais: string[];
  xPais: string[];
  fone: string[];
}

export interface Dest {
  CPF?: string[];
  CNPJ?: string[];
  xNome: string[];
  enderDest: EnderDest[];
  indIEDest: string[];
}

export interface EnderDest {
  xLgr: string[];
  nro: string[];
  xBairro: string[];
  cMun: string[];
  xMun: string[];
  UF: string[];
  CEP: string[];
  cPais: string[];
  xPais: string[];
}

export interface Det {
  $: {
    nItem: string;
  };
  prod: Prod[];
  imposto: Imposto[];
}

export interface Prod {
  cProd: string[];
  cEAN: string[];
  xProd: string[];
  NCM: string[];
  CFOP: string[];
  uCom: string[];
  qCom: string[];
  vUnCom: string[];
  vProd: string[];
  cEANTrib: string[];
  uTrib: string[];
  qTrib: string[];
  vUnTrib: string[];
  indTot: string[];
}

export interface Imposto {
  ICMS: ICMS[];
  IPI: IPI[];
  PIS: PIS[];
  COFINS: COFINS[];
}

export interface ICMS {
  ICMS00: ICMS00[];
}

export interface ICMS00 {
  orig: string[];
  CST: string[];
  modBC: string[];
  vBC: string[];
  pICMS: string[];
  vICMS: string[];
}

export interface IPI {
  cEnq: string[];
  IPINT: IPINT[];
}

export interface IPINT {
  CST: string[];
}

export interface PIS {
  PISNT: PISNT[];
}

export interface PISNT {
  CST: string[];
}

export interface COFINS {
  COFINSNT: COFINSNT[];
}

export interface COFINSNT {
  CST: string[];
}

export interface Total {
  ICMSTot: ICMSTot[];
}

export interface ICMSTot {
  vBC: string[];
  vICMS: string[];
  vICMSDeson: string[];
  vFCPUFDest: string[];
  vICMSUFDest: string[];
  vICMSUFRemet: string[];
  vFCP: string[];
  vBCST: string[];
  vST: string[];
  vFCPST: string[];
  vFCPSTRet: string[];
  vProd: string[];
  vFrete: string[];
  vSeg: string[];
  vDesc: string[];
  vII: string[];
  vIPI: string[];
  vIPIDevol: string[];
  vPIS: string[];
  vCOFINS: string[];
  vOutro: string[];
  vNF: string[];
}

export interface Transp {
  modFrete: string[];
  vol: Vol[];
}

export interface Vol {
  qVol: string[];
  pesoL: string[];
  pesoB: string[];
}

export interface Pag {
  detPag: DetPag[];
}

export interface DetPag {
  tPag: string[];
  vPag: string[];
}

export interface InfAdic {
  infCpl: string[];
}

export interface Compra {
  xPed: string[];
}

export interface InfRespTec {
  CNPJ: string[];
  xContato: string[];
  email: string[];
  fone: string[];
}

export interface ProtNFe {
  $: {
    versao: string;
  };
  infProt: InfProt[];
}

export interface InfProt {
  tpAmb: string[];
  verAplic: string[];
  chNFe: string[];
  dhRecbto: string[];
  nProt: string[];
  digVal: string[];
  cStat: string[];
  xMotivo: string[];
}








  



