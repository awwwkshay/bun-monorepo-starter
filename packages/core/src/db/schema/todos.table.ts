import { boolean, pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";


export const todosTable = pgTable("todos", {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    description: text(),
    isCompleted: boolean().notNull().default(false),
    createdAt: timestamp({mode: "string"}).notNull().defaultNow(),
    updatedAt: timestamp({mode: "string"}).notNull().defaultNow(),
});