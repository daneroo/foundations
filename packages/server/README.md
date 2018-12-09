# `@daneroo/server`

Use these building blocks to wire up an express or graphql server

## TODO

- testing with [supertest](https://github.com/visionmedia/supertest)

## Express

This should address:

- singleton or factory
- injection of configuration (port,cors,requestLogger)
- Mounting/assembling other express.Router's, static middlewaer
- authentication and cors can be global, or specific to routers
- standard routes: health (status), version
- default route for 404, perhaps 500 error handler

## GraphQL

## Usage

```bash
const server = require('@daneroo/server');

server.express().start()
```
