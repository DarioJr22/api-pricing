import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DocumentoFiscal } from './documento-fiscal.entity';
import { ImpostoDocumentoFiscal } from './imposto-documento-fiscal.entity';

/**
 * @description Tabela que armazena os itens contidos em cada documento fiscal.
 */
@Entity('item_documento_fiscal')
export class ItemDocumentoFiscal {
  @PrimaryGeneratedColumn()
  cdItemDocumentoFiscal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlItem: number;

  @Column({ type: 'varchar', length: 500 })
  dsComplementar: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  vlAdicional: number;

  @Column({ type: 'varchar', length: 200 })
  dsProdutoServico: string;

  @Column({ type: 'varchar', length: 15 })
  cdProdutoServico: string;

  // Relacionamento com DocumentoFiscal
  @ManyToOne(() => DocumentoFiscal, (documentoFiscal) => documentoFiscal.itens)
  @JoinColumn({ name: 'cdDocumentoFiscal' })
  cdDocumentoFiscal: DocumentoFiscal;

  // Relacionamento com ImpostoDocumentoFiscal
  @OneToMany(() => ImpostoDocumentoFiscal, (imposto) => imposto.cdItemDocumentoFiscal)
  impostos: ImpostoDocumentoFiscal[];

  // Novas Colunas
  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlCustoItem: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlDescontoItem: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlImpostoItem: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlLucroItem: number;
}


