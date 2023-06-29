# Binnacle App ✨

**🧰 Tools Used**

- [React](https://reactjs.org/) for the frontend 😍
- [Vite](https://vitejs.dev/) for faster and leaner development experience 😅
- [TypeScript](http://www.typescriptlang.org) for Static Typing in JavaScript ([Learn](http://www.typescriptlang.org/docs/handbook/basic-types.html))
- [MobX](https://mobx.js.org/README.html) for state management
- [TSyringe](https://www.npmjs.com/package/tsyringe) for TypeScript dependency Injection
- [Jest](https://jestjs.io) for unit tests
- [Cypress](https://www.cypress.io) for end-to-end testing
- [ESLint](https://eslint.org) for code linting
- [Husky](https://github.com/typicode/husky/tree/master) for running tasks via git hooks
- [Chakra UI](https://chakra-ui.com/) for styling

## 🏗 Setup

> Run these commands from project root.

1. [Install NVM](https://github.com/creationix/nvm#installation-and-update) (Node Version Manager)
2. `nvm install` (this is only for the first time setup, for next times you should use `nvm use` to load version specified in `.nvmrc`)
3. `npm ci` to install project dependencies

### Configure your IDE

If you want to edit the code you should configure the linter to use it when you save the files.

#### VS Code

[Install the ESLint plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and enable "Fix on Save" in `settings.json`:
   ```json
   {
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```
   > Go to settings (`⌘ + ,`), search `codeActionsOnSave` and click "Edit in settings.json", then add `"editor.codeActionsOnSave": {...}` within the existing JSON object.

## 👟 Run

To run the application in develop mode (in your local machine with hot reload) you can use:

```shell
npm run dev
```

Other `npm` scripts are available, for example:

- `build:dev` - build app for production using the dev environment config
- `build:int` - build app for production using the int environment config
- `build:prod` - build app for production using the prod environment config
- `test:unit` - run unit tests on watch mode
- `test:unit:coverage` - run unit tests with coverage
- `test:e2e` - run end-to-end tests

> These scripts are located in `package.json` and do not represent the entirety of available scripts, but are the most commonly used.

## 👷 Run service worker

See how run service worker in local machine

> [See service worker use doc](./doc/SERVICE_WORKER.md)

## 🏛 Structure

Below is the project's file-tree with notes added as inline comments.

```bash
├── public # Static files
├── src
│   ├── assets # Fonts, images, icons, etc.
│   │   └── logo.svg
│   ├── modules # Each module represents a page in the application and doesn't contain data that is often required by other modules!
│   │   ├── binnacle
│   │   │   ├── components # Binnacle module related components
│   │   │   ├── data-access # Code that is related to the data-access layer of this module
│   │   │   │   ├── actions # User interactions that modifies the store
│   │   │   │   ├── interfaces # Data-access related interfaces go here
│   │   │   │   ├── repositories  # Access the data outside the application
│   │   │   │   ├── state # Store definitions
│   │   │   │   ├── utils # Data-access related utilities go here
│   │   │   ├── page # Contains page-specific logic
│   ├── shared # Shared code go here
│   ├── test-utils # Test utilities go here
│   ├── index.tsx # Root application file
│   ├── react-app-env.d.ts # Extends react-scripts TypeScript definitions
│   └── setupTests.ts # Top-level setup for Jest test runs
├── .eslintrc.json # ESLint - Run Commands
├── .nvmrc # Node Version Manager - Run Commands
├── .prettierrc.json # Prettier - Run Commands
├── README.md # 👈 YOU ARE HERE
├── cypress.json # Cypress config
├── package-lock.json
├── package.json
└── tsconfig.json # TypeScript config and extends
```
