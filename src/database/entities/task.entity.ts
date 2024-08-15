import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

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

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
