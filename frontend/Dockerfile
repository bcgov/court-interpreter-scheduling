FROM registry.access.redhat.com/ubi8/nodejs-12:1  as builder

COPY ./package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM registry.access.redhat.com/ubi8/nodejs-12:1 as client
LABEL MAINTAINER="FreshWorks <web@freshworks.io>"

RUN npm i -g serve
COPY --from=builder /opt/app-root/src/build .
COPY --from=builder /opt/app-root/src/serve.json .

CMD ["sh", "-c","serve", "-p", "$PORT", "-s", "."]
