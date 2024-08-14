import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();
import { TypeOrmNamingStrategy } from '../common/helper/typeorm-naming-strategy';
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;

if (
  !DATABASE_HOST ||
  !DATABASE_USER ||
  !DATABASE_PASSWORD ||
  !DATABASE_PORT ||
  !DATABASE_NAME
) {
  throw new Error('Enviroment Database Error');
}

export const dataSource = {
  type: 'postgres',
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  entities: ['src/database/**/*.entity.{js,ts}'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false,
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  namingStrategy: new TypeOrmNamingStrategy(),
  seeds: ['src/database/seeder/seeds/*{.ts,.js}'],
  factories: ['src/database/seeder/factories/*{.ts,.js}'],
};

export const source = new DataSource(<DataSourceOptions>dataSource);
