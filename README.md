# Hubspot Marketing WebTeam ESLing rules for Browsers

This is a list of ESLint rules that are recommended for use with Hubspot Marketing WebTeam projects.

https://www.npmjs.com/package/@hs-web-team/eslint-config-node

<!-- index-start -->
## Index

- [Introduction](#introduction)
- [Setup](#setup)
- [Migrating from an exisiting .eslint config](#migrating-from-an-existing-eslint-config)
- [Where to use it](#where-to-use-it)
<!-- index-end -->

## Introduction

This is a set of ESLint rules that are recommended for use with Hubspot Marketing WebTeam projects, and it also include StyleLint as a linter for CSS/SCSS files.

## Setup

1. Install as dev dependency

```
npm i -D @hs-web-team/eslint-config-node
```

2. Add to `.eslintrc` in project root directory

```json
{
  "extends": "@hs-web-team/eslint-config-node"
}
```

3. Extend the eslint on a project basis by adding rules to  `.eslintrc` e.g.

```
{
  "extends": "@hs-web-team/eslint-config-node",
  "settings": {
    "import/resolver": "webpack"
  }
}
```

4. Extend the style-lint rules on a project basis by adding a`.stylelintrc.json`:

```json
{
  "extends": "./node_modules/@hs-web-team/eslint-config-node/.stylelintrc.json",
  "ignoreFiles": [
    // any folders to ignore
    // e.g. "./dist/**/*.{css,scss,sass}"
  ]
}
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


