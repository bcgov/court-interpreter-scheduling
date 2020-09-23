FROM node:10

ENV PORT 3030
ENV HOME /opt/app-root/src/app

# Creating HOME
USER 0
RUN mkdir -p ${HOME}
RUN chmod -R 777 ${HOME}
RUN chown -R 1001 ${HOME}
RUN npm config rm proxy
RUN npm config rm https-proxy
USER 1001

# Setting Path
ENV PATH /opt/rh/rh-nodejs8/root/usr/bin:/opt/app-root/src/node_modules/.bin/:/opt/app-root/src/app.npm-global/bin/:/opt/app-root/src/app/bin:/opt/app-root/src/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/app-root/src/app/node_modules/.bin:/opt/app-root/src/app/app.npm-global/bin

# Create app directory

WORKDIR ${HOME}


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# RUN npm install --only=production
COPY ./package*.json ./
RUN pwd
RUN ls -a
RUN npm config set registry https://registry.npmjs.org/
RUN npm config get registry
RUN ping -c 4 registry.npmjs.org
RUN npm ci --loglevel verbose

# If you are building your code for production, copy all files
COPY ./ .

# Cleaning any existing generated file
RUN rm -rf ./dist-server



# Setting NODE_PATH
ENV NODE_PATH ${HOME}/node_modules


# Application VOLUME
VOLUME ${HOME}

# Application Port
EXPOSE ${PORT}

# Application Entry point
CMD ["npm", "run", "start:dev"]
