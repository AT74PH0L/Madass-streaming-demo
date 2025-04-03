# Use the lightweight Alpine-based Nginx image
FROM nginx:alpine

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    rm /etc/nginx/conf.d/default.conf && \
    mkdir -p /var/cache/nginx /var/run/ /var/log/nginx && \
    chown -R appuser:appgroup /var/cache/nginx /var/run/ /var/log/nginx /etc/nginx/conf.d

# Copy the custom Nginx configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Switch to non-root user
USER appuser

# Expose HTTP and HTTPS ports
EXPOSE 80 443

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
