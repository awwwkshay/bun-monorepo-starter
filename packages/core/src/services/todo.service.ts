import { db, todosTable } from "@/db";
import type { ITodoInsert, ITodo, ITodoUpdate } from "@/schemas/todo.schema";
import { eq } from "drizzle-orm";

export class TodoService {
    async createTodo(createDto: ITodoInsert): Promise<ITodo> {
        const [newTodo] = await db.insert(todosTable).values(createDto).returning();
        if (!newTodo) throw new Error("Failed to create todo");
        return newTodo;
    }

    async readTodoById(id: string): Promise<ITodo | undefined> {
        const [todo] = await db.select().from(todosTable).where(eq(todosTable.id, id));
        return todo;
    }

    async updateTodo(id: string, updateDto: Partial<ITodoUpdate>): Promise<ITodo | undefined> {
        const [updatedTodo] = await db.update(todosTable).set(updateDto).where(eq(todosTable.id, id)).returning();
        return updatedTodo;
    }

    async deleteTodo(id: string): Promise<ITodo | undefined> {
        const [deletedTodo] = await db.delete(todosTable).where(eq(todosTable.id, id)).returning();
        return deletedTodo;
    }

    async readAllTodos(): Promise<ITodo[]> {
        return await db.select().from(todosTable);
    }
}
