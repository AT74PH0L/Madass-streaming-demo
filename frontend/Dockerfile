FROM node:lts AS builder
WORKDIR /app
COPY . .
RUN npm install 
RUN npm run build 

# ใช้ image ของ Nginx
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html
COPY --from=builder ./app/dist .
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
