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
- [Prettier](https://prettier.io) for code formatting (🚨 DO NOT enable the VS Code Prettier plugin—ESLint runs it for you under the hood. 🎉)
- [Chakra UI](https://chakra-ui.com/) for styling

## 🏗 Setup

> Run these commands from project root.

1. [Install NVM](https://github.com/creationix/nvm#installation-and-update) (Node Version Manager)
2. `nvm install` (in new sessions run `nvm use` to load version specified in `.nvmrc` unless aliased to default)
3. `npm i -g npm@latest` (npm@v7+ required)
4. `npm i` (install project dependencies)
5. [Install the ESLint plugin for ~~your editor~~ VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and enable "Fix on Save" in `settings.json`:
   ```json
   {
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     }
   }
   ```
   > Go to settings (`⌘ + ,`), search `codeActionsOnSave` and click "Edit in settings.json", then add `"editor.codeActionsOnSave": {...}` within the existing JSON object.
   >
   > "But I don't use VS Code." That's fine but you're on your own. 😅
   >
   > 🚨 DO NOT enable the VS Code Prettier plugin for this project—ESLint runs it for you under the hood. 🎉

## 👟 Run

Run the following scripts with `npm run <SCRIPT_HERE>`:

- `dev` - start app
- `build:dev` - build app for production using the dev environment config
- `build:int` - build app for production using the int environment config
- `build:prod` - build app for production using the prod environment config
- `test:unit` - run unit tests on watch mode
- `test:unit:coverage` - run unit tests with coverage
- `test:e2e` - run end-to-end tests

> These scripts are located in `package.json` and do not represent the entirety of available scripts, but are the most commonly used.

## 🏛 Structure

Below is the project's file-tree with notes added as inline comments.

```bash
├── public # 👈 Static files
├── src 
│   ├── assets # 👈 fonts, images, icons, etc.
│   │   └── logo.svg
│   ├── modules # 👈  Each module represents a page in the application and doesn't contain data that is often required by other modules!
│   │   ├── binnacle
│   │   │   ├── components # 👈  binnacle module related components
│   │   │   ├── data-access # 👈  Code that is related to the data-access layer of this module
│   │   │   │   ├── actions # 👈  User interactions that modifies the store
│   │   │   │   ├── interfaces # 👈 Data-access related interfaces go here
│   │   │   │   ├── repositories  # 👈 Access the data outside the application
│   │   │   │   ├── state # 👈 Store definitions
│   │   │   │   ├── utils # 👈 Data-access related utilities go here
│   │   │   ├── page # 👈  Contains page-specific logic
│   ├── shared # 👈  Shared code go here
│   ├── test-utils # 👈  Test utilities go here
│   ├── index.tsx # 👈  Root application file
│   ├── react-app-env.d.ts # 👈  Extends react-scripts TypeScript definitions
│   └── setupTests.ts # 👈  Top-level setup for Jest test runs
├── .eslintrc.json # 👈  ESLint - Run Commands
├── .nvmrc # 👈  Node Version Manager - Run Commands
├── .prettierrc.json # 👈  Prettier - Run Commands
├── README.md # 👈 👈 👈  YOU ARE HERE
├── cypress.json # 👈  Cypress config
├── package-lock.json
├── package.json
└── tsconfig.json # 👈  TypeScript config and extends
```
