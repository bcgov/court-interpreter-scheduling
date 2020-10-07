FROM node:12.18.3-slim as builder

MAINTAINER FreshWorks <web@freshworks.io>

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:12.18.3-slim as client
RUN npm i -g serve
COPY --from=builder /usr/src/app/build .
COPY --from=builder /usr/src/app/serve.json .
CMD ["serve", "-p", "80", "-s", "."]
