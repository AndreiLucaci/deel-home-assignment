import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { User } from './user.model';

export enum ProfileType {
  CLIENT = 'client',
  CONTRACTOR = 'contractor',
  OTHER = 'other',
}

@Table
export class Profile extends BaseModel {
  @AllowNull(false)
  @Column
  firstName: string;

  @AllowNull(false)
  @Column
  lastName: string;

  @AllowNull(false)
  @Column
  profession: string;

  @Column({
    type: DataType.ENUM(...Object.values(ProfileType)),
  })
  type: ProfileType;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User, {
    targetKey: 'id',
    keyType: DataType.UUIDV4,
  })
  user: User;

  @Column
  deletedBy: string;
}
