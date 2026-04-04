import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import { todosTable } from '@/db';
import type z from 'zod';

export const todoSchema = createSelectSchema(todosTable);

export type ITodo = z.infer<typeof todoSchema>;

export const todoInsertSchema = createInsertSchema(todosTable).omit({ id: true, createdAt: true, updatedAt: true });

export type ITodoInsert = z.infer<typeof todoInsertSchema>;

export const todoUpdateSchema = createUpdateSchema(todosTable).omit({ id: true, createdAt: true, updatedAt: true });

export type ITodoUpdate = z.infer<typeof todoUpdateSchema>;