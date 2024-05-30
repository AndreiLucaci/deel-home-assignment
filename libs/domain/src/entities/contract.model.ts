import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.model';

export enum ContractStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  TERMINATED = 'terminated',
}

@Table
export class Contract extends Model {
  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
  })
  terms: string;

  @Column({
    type: DataType.ENUM(...Object.values(ContractStatus)),
  })
  status: ContractStatus;

  @ForeignKey(() => Profile)
  @Column
  clientId: number;

  @BelongsTo(() => Profile, 'clientId')
  client: Profile;

  @ForeignKey(() => Profile)
  @Column
  contractorId: number;

  @BelongsTo(() => Profile, 'contractorId')
  contractor: Profile;
}
