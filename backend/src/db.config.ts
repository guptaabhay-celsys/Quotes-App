import { Quotes } from './entities/quoteEntity';
import { Users } from './entities/userEntity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "Cel12345",
  database: 'Quotesdb',
  entities: [Users, Quotes],
  synchronize: true,
});