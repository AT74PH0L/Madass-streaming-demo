FROM node:lts AS builder
WORKDIR /app
COPY src/ .
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
RUN npm install 
RUN npm run build 

FROM node:lts AS final
WORKDIR /app
COPY --from=builder /app/dist/ dist/
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install --production
CMD ["node", "dist/main.js"]