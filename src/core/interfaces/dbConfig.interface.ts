export type Dialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql';

export interface IDBConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
}

//We can write config on env based
// export interface IDBConfig {
//   development: IDbConfigAttributes;
// }
