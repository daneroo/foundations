# @daneroo/foundations

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Published at [@daneroo/foundations](https://github.com/daneroo/foundations)

This is a personal experiment. You should have no expectations of long term viability or maintenance.

This is an attempt to group re-usable components for several projects.

These are modules that I need in many projects, such as logging, seting up express, etc.
It is an experiment in version management, dependency management and refactoring.

Discuss: `winston` and `morgan` are `devDependencies:` and a `peerDependencies` of `@daneroo/logger`

## TODO

- Common devDeps
- Dependancy management (automated)
  - [See also](https://github.com/semantic-release/semantic-release)
  - [Discussion](https://glebbahmutov.com/blog/renovate-app/)
  - [GreenKeeper](https://greenkeeper.io/)
  - [Renovate](https://renovatebot.com/)
- [Metrics](https://github.com/gajus/iapetus)

## packages/components

- singleton: wrapper for components that follow a singleton pattern
- config: kv store, with defaults, and wrapped in a singleton
  - see: https://github.com/lorenwest/node-config
  - see: https://github.com/dominictarr/rc
- server: http components (express and graphql)
- logger: logging components
  - error: error handling (for logging)
- foundations: working example of the other components

## Operations

```bash
npm i lerna -g ## or prepend lerna commands with npx
lerna bootstrap --hoist

npm test  # or
lerna run test

# to see verbose test output
npm run test -- --concurrency 1 --stream  # or
lerna run test --concurrency 1 --stream

# make your commits and push...

npm login # you may have to login to npm
lerna publish

# less typical
lerna version # interactive
lerna minor # [major | minor | patch | premajor | preminor | prepatch | prerelease]

lerna clean --yes # rm node_modules
```

## Creating a new package

After you create the package, add `scripts:`, `devDependencies:`, and `standrad:`
sections to `package.json`

```bash
lerna create <name> [loc]
lerna create @daneroo/error error
lerna create @daneroo/logger logger
# and add common devDeps as below
```

## Adding (shared) dev dependancies

If it is a peerDependancy, add by hand, and add as a devdependancy

```bash
lerna add jest --dev
lerna add standard --dev

# single package - not shared
lerna add winston packages/logger --dev
lerna add express packages/server --dev
# tyhen add as peerD
```

## Initial Setup

```bash
npx lerna init
```