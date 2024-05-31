import {
  AllowNull,
  Column,
  DataType,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.model';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

@Table
export class User extends Model {
  // for better security, change this and use a UUID generator, not an int (also for collisions)
  @PrimaryKey
  @AllowNull(false)
  @Column
  id: string;

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
}
