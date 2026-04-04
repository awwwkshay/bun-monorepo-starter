import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { todosTable } from './schema';


export const db = drizzle({ 
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema: {
    todosTable
  },
  casing: "snake_case"
});