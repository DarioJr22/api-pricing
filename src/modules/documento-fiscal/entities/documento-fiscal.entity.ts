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
  @PrimaryGeneratedColumn()
  cdDocumentoFiscal: number;

  @Column({ type: 'varchar', length: 15 })
  nrDocumento: string;

  @Column({ type: 'varchar', length: 10 })
  nrSerie: string;

  @Column({ type: 'date' })
  dtEmissao: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlTotal: number;

  @Column({ type: 'varchar', length: 500 })
  xml: string;

  @Column({ type: 'varchar', length: 10 })
  dsModeloFiscal: string;

  @Column({ type: 'varchar', length: 50 })
  dsChaveNfe: string;

  @Column({ type: 'date' })
  dtEntSai: Date;

  @Column({ type: 'varchar', length: 1 })
  indTransac: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlRecuperavel: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlNRecuperavel: number;

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



