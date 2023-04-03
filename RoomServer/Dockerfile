FROM node:latest

WORKDIR /room_server

COPY package.json package.json
COPY tsconfig.json tsconfig.json

COPY ./src ./src

RUN npm install
RUN npx tsc

COPY .env .env