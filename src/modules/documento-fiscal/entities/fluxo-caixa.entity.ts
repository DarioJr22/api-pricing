import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { DocumentoFiscal } from "./documento-fiscal.entity";

@Entity('fluxo_caixa')
export class FluxoCaixa {
  @PrimaryGeneratedColumn()
  cdFluxoCaixa: number;

  @Column({ type: 'varchar', length: 100 })
  dsTipoOperacao: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  vlEntradaCaixa: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  vlSaidaCaixa: number;

  @Column({ type: 'date' })
  dtOperacao: Date;

  // Relacionamento com DocumentoFiscal
  @ManyToOne(() => DocumentoFiscal, (documento) => documento.fluxoCaixa)
  @JoinColumn({ name: 'cdDocumentoFiscal' })
  cdDocumentoFiscal: DocumentoFiscal;
}

