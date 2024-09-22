import { RegimeTributario } from 'src/modules/regime-tributario/entities/regime-tributario.entity/regime-tributario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

/**
 * @description Tabela que armazena informações das empresas ou microempreendedores que utilizam o sistema.
 */
@Entity('pessoa')
export class Pessoa {

 /**
   * @description Nome da pessoa física ou jurídica.
   */
 @PrimaryGeneratedColumn({ 
    comment: 'Nome da pessoa física ou jurídica' })
 CD_PESSOA: number;

  /**
   * @description Nome da pessoa física ou jurídica.
   */
  @Column({ type: 'varchar', length: 12, comment: 'Nome da pessoa física ou jurídica' })
  NM_PESSOA: string;

  /**
   * @description CPF ou CNPJ da pessoa física ou jurídica.
   */
  @Column({ type: 'varchar', length: 12, comment: 'CPF ou CNPJ da pessoa física ou jurídica' })
  NR_CPF_CNPJ: string;

  /**
   * @description Endereço do cliente ou empresa.
   */
  @Column({ type: 'varchar', length: 12, comment: 'Endereço do cliente ou empresa' })
  DS_ENDERECO: string;

  /**
   * @description Número do endereço.
   */
  @Column({ type: 'varchar', length: 12, comment: 'Número do endereço' })
  NR_ENDERECO: string;

  /**
   * @description Logradouro (rua/avenida).
   */
  @Column({ type: 'varchar', length: 12, comment: 'Logradouro (rua/avenida)' })
  DS_LAGRADOURO: string;

  
  /**
   * @description Estado.
   */
  @Column({ type: 'varchar', length: 12, comment: 'Estado' })
  DS_ESTADO: string;


  
  /**
   * @description Bairro.
   */
  @Column({ type: 'varchar', length: 12, comment: 'Bairro' })
  DS_BAIRRO: string;

  
  /**
   * @description CEP.
   */
  @Column({ type: 'varchar', length: 12, comment: 'CEP' })
  DS_CEP: string;

   
    /**
   * @description TELEFONE.
   */
     @Column({ type: 'varchar', length: 12, comment: 'TELEFONE' })
     ENDERECO: string;
  
  /**
   * @description TELEFONE.
   */
   @Column({ type: 'varchar', length: 12, comment: 'TELEFONE' })
   DS_TELEFONE: string;



  /**
   * @description Relacionamento com o regime tributário.
   */
  @ManyToOne(() => RegimeTributario)
  CD_REGIME_TRIBUTARIO: RegimeTributario;
}
