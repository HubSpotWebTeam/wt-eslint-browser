# Hubspot Marketing WebTeam ESLint rules for Browsers

This is a list of ESLint rules that are recommended for use with Hubspot Marketing WebTeam projects.

https://www.npmjs.com/package/@hs-web-team/eslint-config-browser

<!-- index-start -->

## Index

- [Introduction](#introduction)
- [Setup](#setup)
- [Migrating from an exisiting .eslint config](#migrating-from-an-existing-eslint-config)
- [Enable accessibility testing with cypress-axe](#optional-enable-accessibility-testing-with-cypress-axe)
- [Where to use it](#where-to-use-it)
<!-- index-end -->

## Introduction

This is a set of ESLint rules that are recommended for use with Hubspot Marketing WebTeam projects, and it also include StyleLint as a linter for CSS/SCSS files.

## Setup

1. Install as dev dependency

```
npm i -D @hs-web-team/eslint-config-browser
```

2. Add to `.eslintrc` in project root directory

```json
{
  "extends": "@hs-web-team/eslint-config-browser"
}
```

3. Extend the eslint on a project basis by adding rules to `.eslintrc` e.g.

```
{
  "extends": "@hs-web-team/eslint-config-browser",
  "settings": {
    "import/resolver": "webpack"
  }
}
```

4. Extend the style-lint rules on a project basis by adding a`.stylelintrc.json`:

```json
{
  "extends": "./node_modules/@hs-web-team/eslint-config-browser/.stylelintrc.json",
  "ignoreFiles": [
    // any folders to ignore
    // e.g. "./dist/**/*.{css,scss,sass}"
  ]
}
```

5. (Optional) Import cypress default configuration

```js
// cypress.config.js
const { defineConfig } = require('cypress');
const { getDevBaseUrl, config, envs } = require('@hs-web-team/eslint-config-browser/cypress.config.js');

const devBaseUrl = getDevBaseUrl();
const baseUrls = {
  [envs.DEV]: devBaseUrl,
  [envs.QA]: '{{QA_URL}}',
  [envs.PROD]: '{{PROD_URL}}',
};

const baseUrl = baseUrls[envs.currentEnv];
module.exports = defineConfig({
  ...config,
  e2e: {
    baseUrl,
  },
});
```

## Migrating from an existing .eslint config

1. Remove `node_modules`
2. Delete `package-lock.json`
3. `npm i`
4. Re open your vscode/editor workspace
5. Check if `js` linting and `sass` linting works

Reference
https://eslint.org/docs/developer-guide/shareable-configs

## (Optional) Enable accessibility testing with cypress-axe

This package includes a shared accessibility testing setup using [cypress-axe](https://github.com/component-driven/cypress-axe). Projects can opt in with a single import — no need to install `cypress-axe` or `axe-core` directly.

1. Add to `cypress/support/e2e.ts`

```ts
import '@hs-web-team/eslint-config-browser/cypress';
```

This registers `cy.injectAxe()`, `cy.checkA11y()`, and `cy.checkAccessibility()`.

2. Call `cy.injectAxe()` in your project's navigation command, after the page visit e.g.

```ts
// cypress/support/commands.ts
cy.visitPageIfUrlChanged(urlPath).then(() => {
  cy.injectAxe();
});
```

3. Use `cy.checkAccessibility()` in your tests e.g.

```ts
// Check the whole page
cy.checkAccessibility();

// Scope to a specific component
cy.checkAccessibility('.csol-accordion');
```

`cy.checkAccessibility()` adds the `high-contrast` class to `body`, runs WCAG 2.2 Level AA rules only, and logs each violation with its id, help text, impact, element targets, and help URL. TypeScript types are included — no `tsconfig.json` changes required.

## Where to use it

This package is intended to be used as a starting point for ESLint rules for FrontEnd projects, and should be used in browser environments.
