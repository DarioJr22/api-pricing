import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ItemDocumentoFiscal } from './item-documento-fiscal.entity';

/**
 * @description Tabela que armazena os impostos aplicados a cada item de um documento fiscal.
 */
@Entity('imposto_documento_fiscal')
export class ImpostoDocumentoFiscal {
  /**
   * @description Código único do imposto aplicado ao item do documento fiscal (PK).
   */
  @PrimaryGeneratedColumn({ comment: 'Código único do imposto aplicado ao item do documento fiscal' })
  CD_IMPOSTO_DOC_FISCAL: number;

  /**
   * @description Valor da base de cálculo do imposto.
   */
  @Column({ type: 'decimal', precision: 20, scale: 8, comment: 'Valor da base de cálculo do imposto' })
  VL_BASE_CALCULO: number;

  /**
   * @description Valor do imposto calculado.
   */
  @Column({ type: 'decimal', precision: 20, scale: 8, comment: 'Valor do imposto calculado' })
  VL_IMPOSTO: number;

  /**
   * @description Item relacionado ao imposto.
   */
  @ManyToOne(() => ItemDocumentoFiscal)
  CD_ITEM_DOCUMENTO_FISCAL: ItemDocumentoFiscal;
}
