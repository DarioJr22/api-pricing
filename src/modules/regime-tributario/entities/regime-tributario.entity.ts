import { Pessoa } from 'src/modules/pessoa/entities/pessoa.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

/**
 * @description Tabela que armazena os diferentes regimes tributários utilizados na precificação.
 */
@Entity('regime_tributario')
export class RegimeTributario {
  @PrimaryGeneratedColumn()
  cdRegimeTributario: number;

  @Column({ type: 'varchar', length: 255 })
  dsRegimeTributario: string;  // Descrição do regime (ex: Simples Nacional, Lucro Presumido, Lucro Real)

  @Column('simple-json',{nullable: true })
  dsAliquotasAplicaveis: any;  // Alíquotas aplicáveis a este regime tributário

  @Column({ type: 'smallint', default: 0 })
  inAplicacaoDesoneracao: boolean;  // Indica se desoneração fiscal é aplicável (1: Sim, 0: Não)

  // Relacionamento com Empresa
  @OneToMany(() => Pessoa, (pessoas) => pessoas.cdRegimeTributario)
  pessoas: Pessoa[];
}


