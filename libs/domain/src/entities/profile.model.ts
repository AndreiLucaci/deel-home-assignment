import {
  AllowNull,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';

export enum ProfileType {
  CLIENT = 'client',
  CONTRACTOR = 'contractor',
}

@Table
export class Profile extends Model {
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
}
