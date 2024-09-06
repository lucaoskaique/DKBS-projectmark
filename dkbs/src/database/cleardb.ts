import { resources, topics, users } from './database-schema';
import 'dotenv/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

export async function seed() {
  console.log('Clearing...');
  const client = new Pool({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: false,
  });

  const db = drizzle(client);

  await db.delete(topics);
  await db.delete(users);
  await db.delete(resources);

  console.timeEnd('DB has been cleared');
}

seed()
  .then(() => {
    console.log('All cleared!');
  })
  .catch((error) => {
    console.error(error);
  })
  .finally(() => {
    process.exit(0);
  });
