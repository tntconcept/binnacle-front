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
- `test:unit` - run unit tests on watch mode
- `test:unit:coverage` - run unit tests with coverage
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
│   ├── styles            # CSS and styling files
│   └── test-utils        # Utilities for testing
├── README.md             # Readme file for the project
├── cypress.config.ts     # Cypress configuration file
├── index.html            # HTML file serving as the entry point for the application
├── jest.config.js        # Jest configuration file
├── jest.file.js          # Additional Jest configuration file
├── package-lock.json     # Automatically generated file for package-lock information
├── package.json          # Configuration file for Node.js project (dependencies, scripts, etc.)
├── tsconfig.json         # TypeScript configuration file
├── tsconfig.production.json  # TypeScript configuration file for production build
└── vite.config.ts        # Vite configuration file
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

## ✅ Testing

We focus on testing the application from the user's perspective. This means that we should write tests that cover the most important user flows and test the application as a whole. We should avoid testing implementation details. In order to do that we test the components while mocking the repository layer.

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

- [ ] Update to React 18
  - [ ] Use FC<PropsWithChildren> instead of FC<Props>
  - [ ] Update Chakra
  - [ ] Update TypeScript
- [ ] Replace react-responsive with chakra's media query
- [ ] Switch to Vitest
