import { ERP } from 'src/modules/integracao/entity/erp.entity';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { ItemDocumentoFiscal } from './item-documento-fiscal.entity';


/**
 * @description Tabela que armazena as informações de cada documento fiscal emitido ou recebido.
 */
@Entity('documento_fiscal')
export class DocumentoFiscal {
  /**
   * @description Código único identificador do documento fiscal (PK).
   */
  @PrimaryGeneratedColumn({ comment: 'Código único identificador do documento fiscal' })
  CD_DOCUMENTO_FISCAL: number;

  /**
   * @description Número do documento fiscal.
   */
  @Column({ type: 'varchar', length: 15, comment: 'Número do documento fiscal' })
  NR_DOCUMENTO: string;

  /**
   * @description Série do documento fiscal.
   */
  @Column({ type: 'varchar', length: 10, comment: 'Série do documento fiscal' })
  NR_SERIE: string;

  /**
   * @description Data de emissão do documento.
   */
  @Column({ type: 'date', comment: 'Data de emissão do documento' })
  DT_EMISSAO: Date;

  /**
   * @description Valor total do documento fiscal.
   */
  @Column({ type: 'decimal', precision: 12, scale: 2, comment: 'Valor total do documento fiscal' })
  VL_TOTAL: number;

  /**
   * @description Chave de acesso da NF-e.
   */
  @Column({ type: 'varchar', length: 50, comment: 'Chave de acesso da NF-e' })
  DS_CHAVE_NFE: string;

  /**
   * @description Data de entrada ou saída de mercadorias.
   */
  @Column({ type: 'date', comment: 'Data de entrada ou saída de mercadorias' })
  DT_ENT_SAI: Date;

  /**
   * @description Pessoa relacionada ao documento fiscal (FK).
   */
  @ManyToOne(() => Pessoa)
  CD_PESSOA: Pessoa;

  /**
     * @description Erp de origem do documento (FK).
     */
  @ManyToOne(() => ERP)
  CD_ERP: ERP;

  @OneToMany(() => ItemDocumentoFiscal, item => item.CD_DOCUMENTO_FISCAL)
  itensDocumentoFiscal: ItemDocumentoFiscal[];

}
