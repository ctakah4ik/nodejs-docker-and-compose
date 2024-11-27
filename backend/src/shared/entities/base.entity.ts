import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsNumber } from 'class-validator';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  @IsNumber()
  id: number;

  @Column()
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;
}
