import { SequelizeModuleOptions } from '@nestjs/sequelize';

export const SequelizeConfig: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
};
