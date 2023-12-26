import { SisgeaAutenticacaoUsuarioModel } from '@sisgea/spec';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuario')
export class UsuarioDbEntity implements SisgeaAutenticacaoUsuarioModel {
  @PrimaryColumn({ name: 'id' })
  id!: string;

  // ...

  @Column({ name: 'nome', nullable: true, type: 'text' })
  nome!: string | null;

  @Column({ name: 'email', nullable: true, type: 'text' })
  email!: string | null;

  @Column({ name: 'matricula_siape', nullable: true, type: 'text' })
  matriculaSiape!: string | null;

  // ...

  @Column({ name: 'flag_seed_super_usuario', nullable: false, type: 'boolean' })
  flagSeedSuperUsuario!: boolean;

  // ...

  @CreateDateColumn({ name: 'date_created', type: 'timestamptz', nullable: false })
  dateCreated!: Date;

  @UpdateDateColumn({ name: 'date_updated', type: 'timestamptz', nullable: false })
  dateUpdated!: Date;

  @Column({ name: 'date_deleted', type: 'timestamptz', nullable: true })
  dateDeleted!: Date | null;

  // ...
}
