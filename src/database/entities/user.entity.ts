import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

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
}
