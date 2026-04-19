FROM oven/bun:1 AS base
WORKDIR /app

# Copy root workspace config
COPY package.json bun.lock* ./
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Install all workspace deps from root
RUN bun install

# Build
WORKDIR /app/apps/web
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "preview", "--", "--host", "--port", "3000"]
