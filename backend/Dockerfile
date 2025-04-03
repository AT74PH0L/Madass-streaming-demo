FROM node:lts AS builder
WORKDIR /app
COPY src/ .
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
RUN npm install --ignore-scripts
RUN npm run build 

FROM node:lts AS final
# Create a non-root user
RUN useradd -m appuser
USER root

WORKDIR /app
COPY --from=builder /app/dist/ dist/
COPY ./package.json .
COPY ./package-lock.json .

RUN chmod -R 755 /app && chown -R appuser:appuser /app

USER appuser

RUN npm install --production --ignore-scripts

EXPOSE 3000
CMD ["node", "dist/main.js"]