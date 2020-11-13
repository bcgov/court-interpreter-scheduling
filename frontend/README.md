# Court Scheduling Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) V3

## Get started

`npm install`

## Available Scripts

In the project directory, you can run:

### `npm run start`

Local Development

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### E2E Tests

E2E testing is powered by [Cypress](https://cypress.io)

`npm run cypress:open` runs the Cypress GUI

`npm run cypress:run` runs Cypress once and outputs results in terminal

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Docker

build the application in a docker container and serve build artifact:

`docker build . -t courts-react-docker`

run docker container and expose port 8080:

`docker run -it -p 8080:80 courts-react-docker`

Using `Dockerfile.dev`, you can run the `webpack dev server` in a Docker container, useful for running the entire stack via `docker-compose`
