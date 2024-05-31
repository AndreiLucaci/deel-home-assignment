import {
  AllowNull,
  Column,
  DataType,
  Model,
  PrimaryKey,
} from 'sequelize-typescript';
import { v4 as uuid } from 'uuid';

export class BaseModel extends Model {
  // for better security, change this and use a UUID generator, not an int (also for collisions)
  @PrimaryKey
  @AllowNull(false)
  @Column({
    type: DataType.UUIDV4,
    defaultValue: uuid(),
  })
  id: string;
}
