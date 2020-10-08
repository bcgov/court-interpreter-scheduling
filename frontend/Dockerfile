FROM node:12.18.3-slim as builder

ENV HOME /usr/src/app

WORKDIR ${HOME}

COPY ./package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:12.18.3-slim as client
LABEL MAINTAINER="FreshWorks <web@freshworks.io>"
ENV PORT 7070
RUN npm i -g serve
COPY --from=builder /usr/src/app/build .
COPY --from=builder /usr/src/app/serve.json .
EXPOSE ${PORT}
CMD ["sh", "-c","serve", "-p", "$PORT", "-s", "."]
