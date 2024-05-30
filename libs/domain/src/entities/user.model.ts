import {
  AllowNull,
  Column,
  HasOne,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Profile } from './profile.model';

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
}
