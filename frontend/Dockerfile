# Stage 1: Build the application
FROM node:lts AS builder
WORKDIR /app

# Copy only package.json & lock file first for better caching
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Copy source code (excluding sensitive files via `.dockerignore`)
COPY ./src ./src
COPY ./public ./public
COPY ./tsconfig.json .
COPY ./tsconfig.app.json .
COPY ./tsconfig.node.json .
COPY ./vite.config.ts .
COPY ./components.json .
COPY ./.env .
COPY ./index.html .

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx (Minimal & Secure)
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built files from the previous stage
COPY --from=builder ./app/dist . 

# Copy Nginx configuration

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories and assign ownership to the non-root user
RUN mkdir -p /var/cache/nginx /var/run/ /var/log/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/run/ /var/log/nginx /usr/share/nginx/html

# Switch to non-root user
USER appuser

# Expose HTTP ports
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]