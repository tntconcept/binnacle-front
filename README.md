# Binnacle App ✨

**🧰 Tools Used**

- [React](https://reactjs.org/) for the frontend
- [Vite](https://vitejs.dev/) for faster and leaner development experience
- [TypeScript](http://www.typescriptlang.org) for Static Typing in JavaScript ([Learn](http://www.typescriptlang.org/docs/handbook/basic-types.html))
- [TSyringe](https://www.npmjs.com/package/tsyringe) for TypeScript dependency Injection
- [Jest](https://jestjs.io) for unit tests
- [Cypress](https://www.cypress.io) for end-to-end testing
- [ESLint](https://eslint.org) for code linting
- [Husky](https://github.com/typicode/husky/tree/master) for running tasks via git hooks
- [Chakra UI](https://chakra-ui.com/) for styling

## 🏗 Setup

> Run these commands from project root.

1. [Install the latests NodeJS LTS version](https://nodejs.org/en). We recommend installing it through [Volta](https://volta.sh/) or [NVM](https://github.com/creationix/nvm#installation-and-update).
2. `npm ci` to install project dependencies

## 👟 Run

To run the application in develop mode (in your local machine with hot reload) you can use:

```shell
npm run dev
```

Other `npm` scripts are available, for example:

- `build:dev` - build app for production using the dev environment config
- `build:int` - build app for production using the int environment config
- `build:prod` - build app for production using the prod environment config
- `test:unit` - run all tests
- `test:integration` - run integration tests
- `test:e2e` - run end-to-end tests

> These scripts are located in `package.json` and do not represent the entirety of available scripts, but are the most commonly used.

## ⚙️ Configure your IDE

If you want to edit the code you should configure the linter to use it when you save the files.

#### VSCode

[Install the ESLint plugin for VS Code](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and enable "Fix on Save" in `settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

> Go to settings (`⌘ + ,`), search `codeActionsOnSave` and click "Edit in settings.json", then add `"editor.codeActionsOnSave": {...}` within the existing JSON object.

## 👷 Run service worker

See how run service worker in local machine

> [See service worker use doc](docs/SERVICE_WORKER.md)

## 🏛 Structure

```bash
├── cypress               # Cypress directory
│   ├── fixtures          # Test data and sample files for Cypress tests
│   ├── page-objects      # Page objects for Cypress tests
│   ├── component         # Cypress component configuration
│   ├── selectors         # CSS and XPath selectors for Cypress tests
│   ├── support           # Cypress support files (custom commands, plugins, etc.)
│   ├── tests             # Cypress test files
│   └── tsconfig.json     # TypeScript configuration file for Cypress
├── docs                   # Documentation files
├── public                # Public directory (usually static files)
├── src                   # Source directory
│   ├── assets            # Static assets like images, fonts, etc.
│   ├── features          # Feature-specific directories
│   │   ├── featureA      # Directory for feature A
│   │   │   ├── application    # Application layer
│   │   │   ├── domain         # Domain layer
│   │   │   ├── infrastructure # Infrastructure layer
│   │   │   └── ui             # User interface layer
│   ├── shared            # Shared code and resources across features
│   │   ├── arch           # Architectural files
│   │   ├── archimedes     # Archimedes configuration
│   │   ├── components     # Reusable components
│   │   ├── contexts       # React context providers
│   │   ├── di             # Dependency injection configuration
│   │   ├── hooks          # Custom React hooks
│   │   ├── http           # HTTP client configuration and utilities
│   │   ├── i18n           # Internationalization (i18n) resources
│   │   ├── notification   # Notification-related files
│   │   ├── percentage     # Files related to percentage calculations
│   │   ├── providers      # External service providers
│   │   ├── router         # Router configuration and utilities
│   │   ├── types          # Shared TypeScript type definitions
│   │   └── utils          # Shared utility functions
│   ├── styles             # CSS and styling files
│   └── test-utils         # Utilities for testing
├── .commitlintrc.json     # Configuration for Commitlint
├── .env.development       # Environment variables for development
├── .env.integration       # Environment variables for integration
├── .env.production        # Environment variables for production
├── .eslintrc.json         # Configuration for ESLint
├── .gitignore             # Specifies ignored files for Git
├── .lintstagedrc          # Configuration for lint-staged
├── .nvmrc                 # Specifies required Node.js version with NVM
├── .prettierrc.json       # Configuration for Prettier
├── README.md              # Project information
├── cypress.config.ts      # Configuration for Cypress testing
├── index.html             # Main HTML file
├── jest.config.ts         # Configuration for Jest testing
├── package-lock.json      # Dependency lock file for npm
├── package.json           # Project metadata and dependencies
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript configuration for Node.js
└── vite.config.ts         # Configuration for Vite build tool
```

## 🤝 Conventions

1. Filenames and directories should be in `kebab-case`
2. Named exports over default exports. The only exception is when we need to lazy-load files (e.g. `React.lazy`), in the case the page should be exported by default and imported in a `component-lazy.tsx` file
3. Favor an OOP architecture over a functional one. This means that we should use classes and interfaces over functions and types
4. React Components should use the `FC` type:

   ```tsx
   import type { FC } from 'react'

   interface Props {
     value: string
   }

   export const ReactComponent: FC<Props> = ({ value }) => {
     return <h2>{value}</h2>
   }
   ```

5. Don't import `React` directly, always import specific functions from `react`:

   ```tsx
   import { useState } from 'react'
   ```

6. Don't create `index.ts` files to handle barrel exports
7. All imports should be relative
8. All testing imports related to `testing-library` like render, act, screen, userEvent and so on should be imported from the custom `render` file in `src/test-utils/render.tsx`
9. Prefer a `setup` function over `beforeEach` in tests. The `setup` function should be placed at the bottom of the file.

## ✅ Testing

We focus on testing the application from the user's perspective. This means that we should write tests that cover the most important user flows and test the application as a whole. We should avoid testing implementation details. In order to do that we test the components while mocking the repository layer.

We have different types of tests:

- **Unit**: This tests should make heavy use of mocking and focus on specific functionality that would be difficult to test using integration tests.
- **Integration**: This is our preferred way of testing. We use [Cypress Component Testing](https://docs.cypress.io/guides/component-testing/overview) for this. We mock the repositories, replacing them with fakes. We test functionality.
- **E2E**: These are mainly to provide tests that cover whole flows spanning different pages and functionalities that are key to the app.

The tests are colocated in their respective feature. For example, if we have a `featureA` we should have a `featureA` directory with the following structure:

```bash
├── featureA
│   ├── application
│   ├── domain
│   ├── infrastructure
│   ├── ui
│   └── tests
│       ├── flow1.test.ts
│       ├── flow2.test.ts
│       └── flow3.test.ts
```

> All tests have the mocked Date of 2023-03-01T00:00:00.000Z

## TODO

- [ ] Switch to Vitest
- [ ] Review commented out lint rules
- [ ] Review use of any
