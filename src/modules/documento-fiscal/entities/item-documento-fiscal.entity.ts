import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { DocumentoFiscal } from './documento-fiscal.entity';
import { ImpostoDocumentoFiscal } from './imposto-documento-fiscal.entity';

/**
 * @description Tabela que armazena os itens contidos em cada documento fiscal.
 */
@Entity('item_documento_fiscal')
export class ItemDocumentoFiscal {
  @PrimaryGeneratedColumn()
  idItemDocumentoFiscal

  @Column({ type: 'varchar', length: 500 })
  dtEmissao: string; // Código de produto

  @Column({ type: 'varchar', length: 500 })
  nrDocumento: string; // Código de produto
  
  @Column({ type: 'varchar', length: 500 })
  cProd: number; // Código de produto

  @Column({ type: 'varchar', length: 500 })
  xProd: string; //Descrição de produto

  @Column({ type: 'varchar', length: 500 })
  uCom: string; //Unidade comercial - Tipo de unidade

  @Column({ type: 'varchar', length: 500 })
  qCom: string; //Quantidade comercial

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vUnCom: number; //Custo unitário

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vProd: number; //Valor total

  // Relacionamento com DocumentoFiscal
  @ManyToOne(() => DocumentoFiscal, (documentoFiscal) => documentoFiscal.itens)
  @JoinColumn({ name: 'cdDocumentoFiscal' })
  cdDocumentoFiscal: DocumentoFiscal;

  // Relacionamento com ImpostoDocumentoFiscal
  @OneToMany(() => ImpostoDocumentoFiscal, (imposto) => imposto.cdItemDocumentoFiscal)
  impostos: ImpostoDocumentoFiscal[];

}


