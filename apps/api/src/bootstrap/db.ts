import { SequelizeConfig } from '@app/utils/constants/sequelize';
import { Sequelize } from 'sequelize';

export class SequelizeSeeder {
  public async ensureSeed() {
    const sequelize = new Sequelize({
      ...SequelizeConfig,
    });

    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      await sequelize.sync({ force: true });
      console.log('All models were synchronized successfully.');
    } finally {
      await sequelize.close();
      console.log('Connection has been closed.');
    }
  }
}
