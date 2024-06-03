import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Profile } from './profile.model';
import { Job } from './job.model';

export enum ContractStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  TERMINATED = 'terminated',
}

@Table
export class Contract extends BaseModel {
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
  clientId: string;

  @BelongsTo(() => Profile, 'clientId')
  client: Profile;

  @ForeignKey(() => Profile)
  @Column
  contractorId: string;

  @BelongsTo(() => Profile, 'contractorId')
  contractor: Profile;

  @HasMany(() => Job, {
    sourceKey: 'id',
    foreignKey: 'contractId',
    keyType: DataType.UUIDV4,
  })
  jobs: Job[];
}
