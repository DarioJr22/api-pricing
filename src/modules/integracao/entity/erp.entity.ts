import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/**
 * @description Tabela que armazena informações sobre os sistemas ERP integrados ao sistema de precificação.
 */
@Entity('erp')
export class ERP {
  /**
   * @description Código único identificador do sistema ERP (PK).
   */
  @PrimaryGeneratedColumn({ comment: 'Código único identificador do sistema ERP' })
  CD_ERP: number;

  /**
   * @description Descrição ou nome do sistema ERP.
   */
  @Column({ type: 'varchar', length: 100, comment: 'Descrição ou nome do sistema ERP' })
  DS_ERP: string;

  /**
   * @description Indicador se o ERP possui integração automática com o sistema (1: Sim, 0: Não).
   */
  @Column({ type: 'smallint', comment: 'Indicador se o ERP possui integração automática com o sistema (1: Sim, 0: Não)' })
  FL_INTEGRACAO_AUTOMATICA: number;

  /**
   * @description URL para integração via API com o ERP.
   */
  @Column({ type: 'varchar', length: 255, comment: 'URL para integração via API com o ERP' })
  URL_API_INTEGRACAO: string;
}
