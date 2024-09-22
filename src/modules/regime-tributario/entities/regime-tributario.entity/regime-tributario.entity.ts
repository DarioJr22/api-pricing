import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @description Tabela que armazena os diferentes regimes tributários utilizados na precificação.
 */
@Entity('regime_tributario')
export class RegimeTributario {
  /**
   * @description Código único identificador do regime tributário (PK).
   */
  @PrimaryGeneratedColumn({ comment: 'Código único identificador do regime tributário' })
  CD_REGIME_TRIBUTARIO: number;

  /**
   * @description Descrição completa do regime tributário (ex: Simples Nacional, Lucro Presumido).
   */
  @Column({ type: 'varchar', length: 255, comment: 'Descrição completa do regime tributário' })
  DS_REGIME_TRIBUTARIA: string;

  /**
   * @description Descrição das alíquotas aplicáveis a esse regime tributário.
   */
  @Column({ type: 'varchar', length: 500, comment: 'Descrição das alíquotas aplicáveis a esse regime tributário' })
  DS_ALIQUOTAS_APLICAVEIS: string;
}
