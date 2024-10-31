import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ImpostoDocumentoFiscal } from './imposto-documento-fiscal.entity';

/**
 * @description Tabela que armazena os impostos aplicados a cada item de um documento fiscal.
 */
@Entity('imposto')
export class TipoImposto {
  @PrimaryGeneratedColumn()
  cdImposto: number;

  @Column({ type: 'varchar', length: 100 })
  dsImposto: string;  // Ex: ICMS, IPI, PIS, COFINS

  @Column({ type: 'varchar',length: 100 })
  tpImposto: number;  // 1: Federal, 2: Estadual, 3: Municipal

  @Column({ type: 'varchar', length: 20, nullable: true })
  cdOrigemImposto: string;  // Código de origem (ex.: CST, CSOSN, etc.)

  // Relacionamento com ImpostoDocumentoFiscal
  @OneToMany(() => ImpostoDocumentoFiscal, (imposto) => imposto.cdImposto)
  documentos: ImpostoDocumentoFiscal[];
}
