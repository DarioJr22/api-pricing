import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { DocumentoFiscal } from './documento-fiscal.entity';

/**
 * @description Tabela que armazena os itens contidos em cada documento fiscal.
 */
@Entity('item_documento_fiscal')
export class ItemDocumentoFiscal {
  /**
   * @description Código único do item dentro do documento fiscal (PK).
   */
  @PrimaryGeneratedColumn({ comment: 'Código único do item dentro do documento fiscal' })
  CD_ITEM_DOCUMENTO_FISCAL: number;

  /**
   * @description Valor do item no documento fiscal.
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, comment: 'Valor do item no documento fiscal' })
  VL_ITEM: number;

  /**
   * @description Descrição complementar do item.
   */
  @Column({ type: 'varchar', length: 500, comment: 'Descrição complementar do item' })
  DS_COMPLEMENTAR: string;

  /**
   * @description Documento fiscal relacionado ao item.
   */
  @ManyToOne(() => DocumentoFiscal)
  CD_DOCUMENTO_FISCAL: DocumentoFiscal;
}
