import { TipoImposto } from './../entities/imposto.entity';
import { ERP } from "src/modules/integracao/entity/erp.entity";
import { Pessoa } from "src/modules/pessoa/entities/pessoa.entity";
export class DocumentoFiscalDTO {
  nrDocumento: string;
  nrSerie: string;
  dtEmissao: Date;
  vlTotal: number;
  tpNf: string;
  natOp: string;
  xMotivo: string;
  xPag: string;
  nrIde: string;
  nomeCliente: string;
  lagradouroCliente: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  xml: string;
  cdPessoa:Pessoa
  cdErp:ERP
  dsChaveNfe: string;
  dtEntSai: Date;
  vlFrete: number;
  vlSeguro: number;
  vlReceitaBruta: number;
  vlReceitaLiquida: number;
  vlDesconto: number;
  vlCustoProduto: number;
  vlLucroBruto: number;
  vlLucroLiquido: number;
  vlDespesasOperacionais: number;
  vlImpostosTotais: number;

  constructor(nfeData:{retorno: NotaFiscalDTO},cliente:Pessoa) {
    const infNFe = nfeData.retorno.xml_nfe[0].nfeProc[0].NFe[0].infNFe[0];
    const total = infNFe.total[0].ICMSTot[0];
    this.cdPessoa = cliente;
    this.cdErp = cliente.cdErp;
    this.nrDocumento = infNFe.ide[0].nNF[0];
    this.nrSerie = infNFe.ide[0].serie[0];
    this.dtEmissao = new Date(infNFe.ide[0].dhEmi[0]);
    this.vlTotal = parseFloat(total.vNF[0]);
    this.tpNf = infNFe.ide[0].tpNF[0] === '1' ? 'Saída' : 'Entrada';
    this.natOp = infNFe.ide[0].natOp[0];
    this.xMotivo = nfeData.retorno.xml_nfe[0].nfeProc[0].protNFe[0].infProt[0].xMotivo[0]
    this.xPag = infNFe.pag[0].detPag[0].tPag[0];
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
    this.vlCustoProduto = this.vlReceitaLiquida; // Placeholder: Use real calculation if available
    this.vlLucroBruto = this.vlReceitaBruta - this.vlCustoProduto;
    this.vlLucroLiquido = this.vlLucroBruto; // Placeholder: Use real calculation if available
    this.vlDespesasOperacionais = 0; // Placeholder: Add real data
    this.vlImpostosTotais = parseFloat(total.vICMS[0]) + parseFloat(total.vIPI[0] || '0') + parseFloat(total.vCOFINS[0] || '0') + parseFloat(total.vPIS[0] || '0');
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
   

    constructor(nf:{retorno: NotaFiscalDTO},itemNf: Det) {

      const infNFe = nf.retorno.xml_nfe[0].nfeProc[0].NFe[0].infNFe[0];
      this.dtEmissao = `${new Date(infNFe.ide[0].dhEmi[0])}`;  
      this.nrDocumento = infNFe.ide[0].nNF[0]
      this.cProd = itemNf.prod[0].cProd[0];
      this.xProd = itemNf.prod[0].xProd[0];
      this.uCom = itemNf.prod[0].uCom[0];
      this.qCom = itemNf.prod[0].qCom[0];
      this.vUnCom = parseFloat(itemNf.prod[0].vUnCom[0]);
      this.vProd = parseFloat(itemNf.prod[0].vProd[0]);
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








  



