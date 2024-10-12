import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('custos_fixos')
export class CustosFixos {
  @PrimaryGeneratedColumn()
  cdCustoFixo: number;

  @Column({ type: 'varchar', length: 255 })
  dsCustoFixo: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  vlCustoFixo: number;

  @Column({ type: 'date' })
  dtInicioVigencia: Date;

  @Column({ type: 'date', nullable: true })
  dtFimVigencia: Date;
}
