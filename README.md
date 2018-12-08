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

## packages/components

- iserror: Detect if an argument is an Error
- consolify: utility method for serializing argument for logging

## Operations

```bash
npm i lerna -g ## or prepend commands with npx
lerna bootstrap --hoist

lerna run test
lerna run test --concurrency 1 --stream # get the verbose output

# make your commits and push...

npm login # you may have to login to npm
lerna publish

# less typical
lerna version # interactive
lerna minor # [major | minor | patch | premajor | preminor | prepatch | prerelease]

lerna clean --yes # rm node_modules
```

## using the wizard

```bash
npx lerna-wizard
```

## Adding a share dev dependancy

```bash
lerna add jest --dev
lerna add standard --dev
lerna add winston packages/logger --dev
```

## Adding a package

After you create the package, add `scripts:`, `devDependencies:`, and `standrad:`
sections to `package.json`

```bash
lerna create <name> [loc]
npx lerna create @daneroo/error error
npx lerna create @daneroo/logger logger
```

## Initial Setup

```bash
npx lerna init
```