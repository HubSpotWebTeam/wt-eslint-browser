> [!WARNING]
> **⚠️ This package is deprecated.** Browser and React ESLint support is now built into [`@hs-web-team/eslint-config-node`](https://www.npmjs.com/package/@hs-web-team/eslint-config-node) via its `/browser` export. Please migrate — see the [migration guide](#migrating-to-eslint-config-node) below.

---

# Hubspot Marketing WebTeam ESLint rules for Browsers

This is a list of ESLint rules that are recommended for use with Hubspot Marketing WebTeam projects.

https://www.npmjs.com/package/@hs-web-team/eslint-config-browser

<!-- index-start -->

## Index

- [Introduction](#introduction)
- [Setup](#setup)
- [Migrating from an exisiting .eslint config](#migrating-from-an-existing-eslint-config)
- [Where to use it](#where-to-use-it)
- [Migrating to eslint-config-node](#migrating-to-eslint-config-node)
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

## Where to use it

This package is intended to be used as a starting point for ESLint rules for FrontEnd projects, and should be used in browser environments.

---

## Migrating to eslint-config-node

Browser and React ESLint support (including TypeScript) is now unified in [`@hs-web-team/eslint-config-node`](https://www.npmjs.com/package/@hs-web-team/eslint-config-node), which uses ESLint 9's flat config format.

> **Note:** This migration also replaces `@hs-web-team/eslint-config-ts` if you use it — TypeScript support is built into the new package.

Follow these steps to migrate, or see [MIGRATION-V3.md](https://github.com/HubSpotWebTeam/wt-eslint-node/blob/main/docs/MIGRATION-V3.md) for the full guide:

### 1. Replace the old packages

```sh
npm uninstall @hs-web-team/eslint-config-browser @hs-web-team/eslint-config-ts
npm install -D @hs-web-team/eslint-config-node@latest
```

### 2. Replace `.eslintrc` with `eslint.config.mjs`

```js
import wtBrowserConfig from '@hs-web-team/eslint-config-node/browser';

export default [
  ...wtBrowserConfig,
];
```

### 3. Update `package.json` type

```json
{
  "type": "module"
}
```

### 4. See the full setup guide

See the [wt-eslint-node README](https://github.com/HubSpotWebTeam/wt-eslint-node#browserreact-setup) for full browser/React setup instructions, Stylelint, Cypress, and Prettier configuration.
