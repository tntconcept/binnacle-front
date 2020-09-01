This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:
- `npm run start` Runs the app in development mode and opens the browser at `http://localhost:3000`
- `npm run build` Builds the app for production to the build folder. It correctly bundles React in production mode and optimizes the build for the best performance.
- `npm run test` Runs the **JEST** test watcher in watch mode (Every time you save a file, it will re-run the tests). By default, runs tests related to files changed since the last commit.

## How to start the app
Before all:
- Clone the [back-end repository](https://github.com/autentia/binnacle-api-kotlin)
- Run `docker-compose up` in the back-end project root folder
- Run Spring Boot

1. Run `yarn install` or `npm install` to install the dependencies
2. Run `yarn start` or `npm start` to start the development server.

## Cypress component testing
You can unit test your components using [Cypress](https://www.cypress.io) to run the the component in the real browser with the full power of Cypress E2E test runner.

In this way is easier to perform:
- Interaction tests:  render a component and then interact with it in the browser, asserting things about the way it renders and changes.
- Visual regression tests: capture screenshots of every scenario and compare them against known baselines. They’re great for catching UI appearance bugs.
- Accessibiliy tests
- Cross browser testing

You can learn more about this aproach at [Cypress React Unit Test](https://github.com/bahmutov/cypress-react-unit-test)

The component tests that support cypress component testing must have the `.spec.tsx` file extension.
Run `yarn cypress` or `npm run cypress` to open the Cypress UI and select the component test that you want to run.

If you want to run all cypress tests then run `yarn cypress:run` or `npm run cypress:run`.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
