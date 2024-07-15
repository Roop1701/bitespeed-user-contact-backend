import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../config/db.config';
import { Logger } from '@nestjs/common';
export const databaseProvider = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize(databaseConfig);
      sequelize.addModels([]);
      await sequelize.sync();
      console.log('Database connection established');
      return sequelize;
    },
  },
];
