import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from './task.entity';

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', unique: true })
  public email!: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  @Exclude()
  public password!: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public firstName: string | null;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public lastName: string | null;

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @OneToMany(() => Task, (task) => task.createdBy)
  tasks?: Task[];
}
