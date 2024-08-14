import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity as TypeOrmBaseEntity,
} from 'typeorm';

export class BaseEntity extends TypeOrmBaseEntity {
  @PrimaryGeneratedColumn('increment')
  id?: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  createdBy?: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  updatedBy?: string;
}
