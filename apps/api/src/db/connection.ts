import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { todoModel } from "@bun-monorepo/core";

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema: {
    todoModel,
  },
  casing: "snake_case",
});
