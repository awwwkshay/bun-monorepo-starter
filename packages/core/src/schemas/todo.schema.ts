import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { todoModel } from "@/models";
import type z from "zod";

export const todoSchema = createSelectSchema(todoModel);

export type ITodo = z.infer<typeof todoSchema>;

export const todoInsertSchema = createInsertSchema(todoModel).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ITodoInsert = z.infer<typeof todoInsertSchema>;

export const todoUpdateSchema = createUpdateSchema(todoModel).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type ITodoUpdate = z.infer<typeof todoUpdateSchema>;
