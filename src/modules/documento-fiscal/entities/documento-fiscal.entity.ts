import { ERP } from 'src/modules/integracao/entity/erp.entity';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { FluxoCaixa } from './fluxo-caixa.entity';
import { ItemDocumentoFiscal } from './item-documento-fiscal.entity';


/**
 * @description Tabela que armazena as informações de cada documento fiscal emitido ou recebido.
 */
@Entity('documento_fiscal')
export class DocumentoFiscal {

  /* Identificação da Nota  */
  @PrimaryGeneratedColumn()
  cdDocumentoFiscal: number;

  @Column({ type: 'varchar', length: 200 })
  nrDocumento: string;

  @Column({ type: 'varchar', length: 10 })
  nrSerie: string;

  @Column({ type: 'date' })
  dtEmissao: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlTotal: number;

  /* Categorização da nota */
  @Column({ type: 'varchar', length: 200 }) //Tipo da nota -- (Entrada / Saída)
  tpNf: string;

  @Column({ type: 'varchar', length: 200 }) //Natureza da operação
  natOp: string;

  @Column({ type: 'varchar', length: 200 }) //Descrição literal do status da nota 
  xMotivo: string;

  @Column({ type: 'varchar', length: 200 }) //Forma / Canal de pagamento 
  xPag: string;


  /* Identificação do cliente (dest) */
  @Column({ type: 'varchar'}) //Onde vai ficar cpf cnpj
  nrIde: string;


  @Column({ type: 'varchar'}) //Onde vai ficar cpf cnpj
  nomeCliente: string;


  @Column({ type: 'varchar'}) //Rua + Nr
  lagradouroCliente: string;

  @Column({ type: 'varchar'}) 
  bairro: string;

  @Column({ type: 'varchar'}) //Cidade
  cidade: string;

  @Column({ type: 'varchar'}) //Rua + Nr
  uf: string;

  @Column({ type: 'varchar'}) //Rua + Nr
  cep: string;


  @Column({ type: 'varchar', length: 1000000 })
  xml: string;

  @Column({ type: 'varchar', length: 50 })
  dsChaveNfe: string;

  @Column({ type: 'date' })
  dtEntSai: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlFrete: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlSeguro: number;

  // Relacionamento com Pessoa
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.documentos)
  @JoinColumn({ name: 'cdPessoa' })
  cdPessoa: Pessoa;

  // Relacionamento com ERP
  @ManyToOne(() => ERP, (erp) => erp.documentos)
  @JoinColumn({ name: 'cdErp' })
  cdErp: ERP;

  // Novas Colunas
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlReceitaBruta: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlReceitaLiquida: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlDesconto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlCustoProduto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlLucroBruto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlLucroLiquido: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlDespesasOperacionais: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlImpostosTotais: number;

  // Relacionamento com FluxoCaixa
  @OneToMany(() => FluxoCaixa, (fluxoCaixa) => fluxoCaixa.cdDocumentoFiscal)
  fluxoCaixa: FluxoCaixa[];

  // Relacionamento com Itens do Documento
  @OneToMany(() => ItemDocumentoFiscal, (item) => item.cdDocumentoFiscal)
  itens: ItemDocumentoFiscal[];
}



