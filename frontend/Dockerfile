FROM node:12.18.3-slim as builder

LABEL MAINTAINER="FreshWorks <web@freshworks.io>"
ENV HOME /opt/app-root/src/app

# Creating HOME
USER 0
RUN mkdir -p ${HOME}
RUN chmod -R 777 ${HOME}
RUN chown -R 1001 ${HOME}
USER 1001

WORKDIR ${HOME}

COPY ./package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:12.18.3-slim as client
ENV PORT 7070
ENV HOME /opt/app-root/src/app
RUN npm i -g serve
COPY --from=builder ${HOME}/build .
COPY --from=builder ${HOME}/serve.json .
EXPOSE ${PORT}
CMD ["sh", "-c","serve", "-p", "$PORT", "-s", "."]
