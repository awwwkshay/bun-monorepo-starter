import { todoCreateRequestBodySchema, todoCreateResponseSchema, todoReadAllApiResponseSchema, todoReadByIdApiResponseSchema, todoReadByIdRequestParamsSchema } from "@/schemas";
import { createRoute, z } from "@hono/zod-openapi";

export const readAllRouteDef = createRoute({
    method: "get",
    path: "",
    request: {},
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: todoReadAllApiResponseSchema
                }
            },
            description: "Read all todos"
        }
    }
})

export const createRouteDef = createRoute({
    method: "post",
    path: "",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: todoCreateRequestBodySchema
                }
            }
        }
    },
    responses: {
        201: {
            content: {
                "application/json": {
                    schema: todoCreateResponseSchema
                }
            },
            description: "Create a new todo"
        }
    }
});

export const readByIdRouteDef = createRoute({
    method: "get",
    path: "/{id}",
    request: {
        params: todoReadByIdRequestParamsSchema
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: todoReadByIdApiResponseSchema
                }
            },
            description: "Read a todo by id"
        }
    }
})

export const updateRouteDef = createRoute({
    method: "put",
    path: "/{id}",
    request: {
        params: todoReadByIdRequestParamsSchema,
        body: {
            content: {
                "application/json": {
                    schema: todoCreateRequestBodySchema
                }
            }
        }
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: todoReadByIdApiResponseSchema
                }
            },
            description: "Update a todo by id"
        }
    }
})

export const deleteRouteDef = createRoute({
    method: "delete",
    path: "/{id}",
    request: {
        params: todoReadByIdRequestParamsSchema,
    },
    responses: {
        200: {
            content: {
                "application/json": {
                    schema: todoReadByIdApiResponseSchema
                }
            },
            description: "Delete a todo by id"
        }
    }
})

