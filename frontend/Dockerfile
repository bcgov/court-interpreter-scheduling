FROM node:12.18.3-slim as builder

ENV HOME /opt/app-root/src/app

WORKDIR ${HOME}

COPY ./package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:12.18.3-slim as client
LABEL MAINTAINER="FreshWorks <web@freshworks.io>"
ENV PORT 7070
ENV CLIENT_HOME /opt/app-root/src/app
WORKDIR ${CLIENT_HOME}
RUN npm i -g serve
COPY --from=builder ${HOME}/build .
COPY --from=builder ${HOME}/serve.json .
EXPOSE ${PORT}
CMD ["sh", "-c","serve", "-p", "$PORT", "-s", "."]
