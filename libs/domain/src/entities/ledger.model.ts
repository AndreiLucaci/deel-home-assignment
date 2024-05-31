import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Profile } from './profile.model';

export enum LedgerType {
  TRANSACTION = 'transaction',
  SNAPSHOT = 'snapshot',
}

@Table
export class Ledger extends BaseModel {
  @ForeignKey(() => Profile) // in a real application, this should link up to the user not profile, as profile is a sub-entity of user
  @Column({ allowNull: false })
  holderId: string;

  @BelongsTo(() => Profile, {
    targetKey: 'id',
    keyType: DataType.UUIDV4,
  })
  holder: Profile;

  @Column({ allowNull: false })
  amount: number;

  // we can extend upon this to create one-to-many relationships between ledger entries
  @Column({
    type: DataType.UUIDV4,
  })
  fromId: string;

  @Column({
    type: DataType.UUIDV4,
  })
  toId: string;

  // we can have a precomputed snapshot of the ledger for a given time
  @Column({
    type: DataType.ENUM(...Object.values(LedgerType)),
  })
  type: LedgerType;
}
