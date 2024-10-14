import { DocumentoFiscal } from 'src/modules/documento-fiscal/entities/documento-fiscal.entity';
import { RegimeTributario } from 'src/modules/regime-tributario/entities/regime-tributario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

/**
 * @description Tabela que armazena informações das empresas ou microempreendedores que utilizam o sistema.
 */
@Entity('pessoa')
export class Pessoa {
  @PrimaryGeneratedColumn()
  cdPessoa: number;

  @Column({ type: 'varchar', length: 100 })
  nmPessoa: string;

  @Column({ type: 'varchar', length: 100 })
  nrCpfCnpj: string;

  @Column({ type: 'varchar', length: 200 })
  dsEndereco: string;

  @Column({ type: 'varchar', length: 50 })
  dsEstado: string;

  @Column({ type: 'varchar', length: 15 })
  dsCep: string;

  @Column('simple-array')
  dsTelefones: string[];

  @Column('simple-json',{nullable:false})
  apiKey:any

  @Column({type:'varchar',length:12})
  user:string

  @Column({type:'varchar',length:12})
  password:string

  @Column({type:'varchar',length:100})
  email:string

  @ManyToOne(() => RegimeTributario, (regime) => regime.pessoas)
  @JoinColumn({ name: 'cdRegimeTributario' })
  cdRegimeTributario: RegimeTributario;

  @OneToMany(() => DocumentoFiscal, (documento) => documento.cdPessoa)
  documentos: DocumentoFiscal[];
}

