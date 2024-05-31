import {
  AllowNull,
  Column,
  DataType,
  HasOne,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.model';
import { BaseModel } from './base.model';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

@Table
export class User extends BaseModel {
  @AllowNull(false)
  @Column
  name: string;

  @AllowNull(false)
  @Column
  email: string;

  @AllowNull(false)
  @Column
  password: string;

  @HasOne(() => Profile)
  profile: Profile;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...Object.values(Roles)),
    defaultValue: Roles.USER,
  })
  role: Roles;

  @Column
  deletedBy: string;
}
