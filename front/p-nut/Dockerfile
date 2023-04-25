 # syntax=docker/dockerfile:1
FROM node:18
WORKDIR /front/p-nut
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 5173
CMD [ "vite", "build" ]