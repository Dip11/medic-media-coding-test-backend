import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Task extends BaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar' })
  public title!: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: true })
  public detail: string | null;

  @ApiProperty()
  @Column({ type: 'date', default: () => 'CURRENT_TIMESTAMP' })
  dueDate: string;
}
