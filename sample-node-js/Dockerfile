FROM node:10




# Creating HOME
RUN apt-get install dnsutils



RUN dig +trace registry.npmjs.org
# If you are building your code for production, copy all files

# Application Entry point
CMD ["npm", "run", "start-server"]
