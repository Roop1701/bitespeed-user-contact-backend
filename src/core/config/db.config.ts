import * as dotenv from 'dotenv';
import { IDBConfig } from '../interfaces/dbConfig.interface';
import { Dialect } from '../interfaces/dbConfig.interface';
dotenv.config();

export const databaseConfig: IDBConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: process.env.DB_DIALECT as Dialect,
};
