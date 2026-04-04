import { Hono } from "hono";
import { todoRouter } from "./routers/todo.router";
import { Scalar } from "@scalar/hono-api-reference";
import { OpenAPIHono, z } from "@hono/zod-openapi";

const app = new OpenAPIHono({

})

app.onError((err, c) => {
  console.error("Global error handler caught:", err);
  if (err instanceof z.ZodError) {
    return c.json({ success: false, error: { name: "ZodError", issues: err.issues } }, 400);
  }
  return c.json({ success: false, error: err.message }, 500);
});

app.get("/health", (c) => {
    return c.json({ healthy: true });
})

app.route("/todos", todoRouter)

app.doc('/openapi', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Bun Monorepo API',
  },
})

app.get(
  '/scalar',
  Scalar((c) => {
    return {
      url: '/openapi',
      favicon: '',
    }
  })
)

const PORT = process.env.PORT || 8000;

console.log(`Starting API server on port ${PORT}...`);

Bun.serve({
    fetch: app.fetch,
    port: PORT,
});

console.log(`Check API server health at http://localhost:${PORT}/health`);