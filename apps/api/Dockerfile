FROM oven/bun:1 AS base
WORKDIR /app

# Copy root workspace config
COPY package.json bun.lock* ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install all workspace deps from root
RUN bun install

# Build
WORKDIR /app/apps/api
RUN bun run build

EXPOSE 8000
CMD ["bun", "run", "start"]
