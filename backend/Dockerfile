FROM node:lts AS bulider
WORKDIR /app
COPY src/ .
COPY ./package.json .
COPY ./package-lock.json .
COPY ./tsconfig.json .
RUN npm install 
RUN npm run build 

FROM node:lts AS final
WORKDIR /app
COPY --from=bulider /app/dist/ dist/
COPY ./package.json .
COPY ./package-lock.json .
COPY ./cert/ cert/
RUN npm install --production
CMD ["node", "dist/main.js"]