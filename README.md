# @daneroo/foundations


[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

Published at [@daneroo/foundations]()
This is an attempt to group many re-usable components for several projects.

These are things that I need in many projects, such as logging, seting up express, etc.

This is an experiment in version management, dependency management and refactoring.

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
lerna bootstrap --hoist

lerna run test
lerna run test --stream  # get the verbose output

lerna publish
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
```

## Adding a package

```bash
lerna create <name> [loc]
npx lerna create @daneroo/error error
```

## Initial Setup

```bash
npx lerna init
```