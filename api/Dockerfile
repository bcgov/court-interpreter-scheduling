FROM registry.access.redhat.com/ubi8/nodejs-12:1 

COPY ./package*.json ./
RUN npm ci
COPY ./ .
RUN npm run build

CMD ["npm", "run", "start:prod"]
