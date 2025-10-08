# Stage 1: Build the application
FROM node:lts AS builder

# Install bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

WORKDIR /app
COPY . .

# Install dependencies
RUN bun install

# Build the application
RUN bun run build

# Stage 2: Serve the application
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Set environment variables
ENV FASTAPI_URL=http://backend:80

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
