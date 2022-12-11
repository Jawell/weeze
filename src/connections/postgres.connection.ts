import * as dotenv from 'dotenv';
dotenv.config();
import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';

// connection config used for Data Source, seeds and typeorm CLI
const connectionConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['src/entities/**/!(base)*.entity{.js,.ts}'],
  migrations: ['src/migrations/**/*{.js,.ts}'],
  synchronize: false,
};

export const postgresConnection = new DataSource(connectionConfig);

export default connectionConfig;
