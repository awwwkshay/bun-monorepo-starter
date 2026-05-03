import { todoInsertSchema, todoSchema, todoUpdateSchema } from "@bun-monorepo/core";
import { createApiResponseSchema } from "./apiResponse.schema";
import z from "zod";

export const todoCreateResponseSchema = createApiResponseSchema(todoSchema);
export const todoCreateRequestBodySchema = todoInsertSchema;
export const todoReadAllApiResponseSchema = createApiResponseSchema(z.array(todoSchema));
export const todoReadByIdApiResponseSchema = createApiResponseSchema(todoSchema);
export const todoReadByIdRequestParamsSchema = z.object({
  id: z.string().uuid(),
});
export const todoUpdateApiResponseSchema = createApiResponseSchema(todoSchema);
export const todoUpdateRequestParamsSchema = z.object({
  id: z.string().uuid(),
});
export const todoUpdateRequestBodySchema = todoUpdateSchema;
export const todoDeleteApiResponseSchema = createApiResponseSchema(todoSchema);
export const todoDeleteRequestParamsSchema = z.object({
  id: z.string().uuid(),
});
