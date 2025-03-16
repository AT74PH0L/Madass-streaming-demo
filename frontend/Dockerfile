# ใช้ image ของ Nginx
FROM nginx:alpine

# ตั้งค่าตำแหน่งทำงานภายใน container
WORKDIR /usr/share/nginx/html


COPY ./dist .
# คัดลอกไฟล์การตั้งค่า Nginx ของคุณไปที่ container
# COPY nginx.conf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# คัดลอกไฟล์ที่ build แล้ว (dist/) ไปยังตำแหน่งที่ Nginx ใช้ serve

# เปิดพอร์ตที่ Nginx ฟัง (HTTP: 80)
# EXPOSE 80 443

# ใช้คำสั่ง nginx เพื่อเริ่มเซิร์ฟเวอร์
CMD ["nginx", "-g", "daemon off;"]
