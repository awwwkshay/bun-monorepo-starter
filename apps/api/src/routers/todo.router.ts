import { createRouteDef, deleteRouteDef, readAllRouteDef, readByIdRouteDef, updateRouteDef } from "@/openapi-docs";
import { TodoService } from "@bun-monorepo/application"
import { OpenAPIHono, z } from '@hono/zod-openapi'
import { db } from "@/db"

export const todoRouter = new OpenAPIHono();

const todoService = new TodoService(db);


todoRouter.openapi(readAllRouteDef, async (c) => {
    const todos = await todoService.readAllTodos();
    return c.json({ message: "Successfully read all todos", data: todos });
});

todoRouter.openapi(createRouteDef, async (c) => {
    const newTodo = await todoService.createTodo(c.req.valid("json"));
    return c.json({ message: "Successfully created new todo", data: newTodo }, 201);
});

todoRouter.openapi(readByIdRouteDef, async (c) => {
    const { id } = c.req.valid("param");
    const todo = await todoService.readTodoById(id);
    return c.json({ message: `Successfully read todo with id '${id}'`, data: todo });
});

todoRouter.openapi(updateRouteDef, async (c) => {
    const { id } = c.req.valid("param");
    const updatedTodo = await todoService.updateTodo(id, c.req.valid("json"));
    return c.json({ message: `Successfully updated todo with id '${id}'`, data: updatedTodo });
});

todoRouter.openapi(deleteRouteDef, async (c) => {
    const { id } = c.req.valid("param");
    const deletedTodo = await todoService.deleteTodo(id);
    return c.json({ message: `Successfully deleted todo with id '${id}'`, data: deletedTodo });
});

