import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../config/db.config';
import { Contact } from 'src/schema/contact.schema';

export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(databaseConfig);
      sequelize.addModels([Contact]);
      await sequelize.sync();
      console.log('Database connection established');
      return sequelize;
    },
  },
];
