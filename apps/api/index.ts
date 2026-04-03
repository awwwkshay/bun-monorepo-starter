import { Hono } from "hono";

const app = new Hono()

app.get("/health", (c) => {
    return c.json({ healthy: true });
})

const PORT = process.env.PORT || 8000;

console.log(`Starting API server on port ${PORT}...`);

Bun.serve({
    fetch: app.fetch,
    port: PORT,
});

console.log(`Check API server health at http://localhost:${PORT}/health`);