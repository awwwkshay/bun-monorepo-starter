import { todoModel } from "@bun-monorepo/core";
import type { ITodoInsert, ITodo, ITodoUpdate } from "@bun-monorepo/core";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

export class TodoService<TDatabase extends NodePgDatabase<Record<string, unknown>>> {
    constructor(private database: TDatabase) {
    }

    async createTodo(createDto: ITodoInsert): Promise<ITodo> {
        const [newTodo] = await this.database.insert(todoModel).values(createDto).returning();
        if (!newTodo) throw new Error("Failed to create todo");
        return newTodo;
    }

    async readTodoById(id: string): Promise<ITodo | undefined> {
        const [todo] = await this.database.select().from(todoModel).where(eq(todoModel.id, id));
        return todo;
    }

    async updateTodo(id: string, updateDto: Partial<ITodoUpdate>): Promise<ITodo | undefined> {
        const [updatedTodo] = await this.database.update(todoModel).set(updateDto).where(eq(todoModel.id, id)).returning();
        return updatedTodo;
    }

    async deleteTodo(id: string): Promise<ITodo | undefined> {
        const [deletedTodo] = await this.database.delete(todoModel).where(eq(todoModel.id, id)).returning();
        return deletedTodo;
    }

    async readAllTodos(): Promise<ITodo[]> {
        return await this.database.select().from(todoModel);
    }
}
