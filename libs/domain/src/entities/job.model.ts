import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Contract } from './contract.model';

@Table
export class Job extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  description: string;

  @AllowNull(false)
  @Column({
    type: DataType.DECIMAL(12, 2),
  })
  price: number;

  @Default(false)
  @Column({
    type: DataType.BOOLEAN,
  })
  paid: boolean;

  @Column({
    type: DataType.DATE,
  })
  paymentDate: Date;

  @ForeignKey(() => Contract)
  @Column
  contractId: number;

  @BelongsTo(() => Contract, 'contractId')
  contract: Contract;
}