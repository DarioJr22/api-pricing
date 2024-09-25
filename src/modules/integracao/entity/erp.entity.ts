import { DocumentoFiscal } from 'src/modules/documento-fiscal/entities/documento-fiscal.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

/**
 * @description Tabela que armazena informações sobre os sistemas ERP integrados ao sistema de precificação.
 */
@Entity('erp')
export class ERP {
  @PrimaryGeneratedColumn()
  cdErp: number;

  @Column({ type: 'varchar', length: 100 })
  dsErp: string;

  @Column({ type: 'smallint' })
  flIntegracaoAutomatica: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  urlApiIntegracao: string;

  // Relacionamento com DocumentoFiscal
  @OneToMany(() => DocumentoFiscal, (documento) => documento.cdErp)
  documentos: DocumentoFiscal[];
}

