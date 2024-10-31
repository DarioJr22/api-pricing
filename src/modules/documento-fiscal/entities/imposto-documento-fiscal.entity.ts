import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ItemDocumentoFiscal } from './item-documento-fiscal.entity';
import { TipoImposto } from './imposto.entity';

/**
 * @description Tabela que armazena os impostos aplicados a cada item de um documento fiscal.
 */
@Entity('imposto_documento_fiscal')
export class ImpostoDocumentoFiscal {
  @PrimaryGeneratedColumn()
  cdImpostoDocFiscal: number;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  vlImposto: number;

  // Relacionamento com ItemDocumentoFiscal
  @ManyToOne(() => ItemDocumentoFiscal, (itemDocumentoFiscal) => itemDocumentoFiscal.impostos)
  @JoinColumn({ name: 'cdItemDocumentoFiscal' })
  cdItemDocumentoFiscal: ItemDocumentoFiscal;

  // Relacionamento com Imposto
  @ManyToOne(() => TipoImposto, (imposto) => imposto.documentos)
  @JoinColumn({ name: 'cdImposto' })
  cdImposto: TipoImposto;
}


