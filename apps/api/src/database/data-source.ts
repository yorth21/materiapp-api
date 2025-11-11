import { DataSource, DataSourceOptions } from 'typeorm';

const isProduction = process.env.NODE_ENV === 'production';

console.log('Database connection settings:');
console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`Port: ${process.env.DB_PORT || '5432'}`);
console.log(`Username: ${process.env.DB_USERNAME || 'postgres'}`);
console.log(`Database: ${process.env.DB_DATABASE || 'mydb'}`);

console.log(`Running in ${isProduction ? 'production' : 'development'} mode`);

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'mydb',
  synchronize: false,
  logging: true,
};

const dataSource = new DataSource({
  ...dataSourceOptions,
  entities: isProduction
    ? ['dist/apps/api/**/*.entity.js']
    : ['apps/api/src/**/*.entity.ts'],
  migrations: isProduction
    ? ['dist/apps/api/src/database/migrations/*.js']
    : ['apps/api/src/database/migrations/*.ts'],
});

export default dataSource;
