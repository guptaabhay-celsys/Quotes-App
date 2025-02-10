import { Quotes } from './entities/quoteEntity';
import { Users } from './entities/userEntity';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "ep-fragrant-paper-a8oqda2w-pooler.eastus2.azure.neon.tech",
  port: 5432,
  username: "neondb_owner",
  password: "npg_C0x3psgncmdi",
  database: 'neondb',
  entities: [Users, Quotes],
  synchronize: true,
  ssl: { rejectUnauthorized: false }
});