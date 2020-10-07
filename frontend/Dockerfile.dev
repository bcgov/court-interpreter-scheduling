FROM node:12.18.3-slim as builder

MAINTAINER FreshWorks <web@freshworks.io>

WORKDIR /usr/src/app

COPY package.json ./
RUN npm install
COPY . ./
ARG REACT_APP_API_URL=http://localhost:4000
ENV REACT_APP_API_URL http://localhost:4000
RUN npm run build

FROM node:12.18.3-slim as client
RUN npm i -g serve
COPY --from=builder /usr/src/app/build .
CMD ["serve", "-p", "80", "-s", "."]
