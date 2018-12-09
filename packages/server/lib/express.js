'use strict'

module.exports = {
  start,
  stop,
  newServer
}

// TODO(daneroo): proper error handling: https://github.com/B1naryStudio/express-api-response
// OR move to http://restify.com/

// dependencies - core-public-internal
const path = require('path')
const http = require('http')
const express = require('express')
const morgan = require('morgan')
const { log } = require('@daneroo/logger')

// User global config singleton
const config = {
  express: {
    port: 7000
  }
}

// express init -
// TODO(daneroo): through singleton?
function newServer (/* config */) {
  const app = express()
  const server = http.createServer(app)
  return { app, server }
}

const singleton = newServer()

// should be a method of (newServer), but don;t want any Objects or classes...
function start () {
  // get the singleton, so we can stop()...
  const { app, server } = singleton

  app.use(requestLogger(/* config */))

  // app.use('/api', api())
  app.use('/', defaultRouter())

  // static app
  app.use(express.static(path.join(__dirname, 'public')))

  // TODO(daneroo): error handler
  // TODO(daneroo): SIGTERM handler and gracefull shutdown
  // https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
  // Lightship https://github.com/gajus/lightship

  server.listen(config.express.port, function (error) {
    if (error) {
      log.error(error)
      return
    }
    log.info(`Express server listening on port *:${config.express.port}`)
  })
}
function stop () {
  const { server } = singleton
  server.close()
}

// TODO(daneroo): move to logger: use config? singleton
// see usage of morgan-json in dash-timeline trial (commented out)
//  and this article: http://tostring.it/2014/06/23/advanced-logging-with-nodejs/
function requestLogger () {
  const morganStream = {
    write: function (message /*, encoding */) {
      // trim to remove new line
      log.info(message.trim())
    }
  }
  return morgan('tiny', { // dev has color - we really want structured logging
    skip: function (req /*, res */) {
      return req.url === '/metrics'
    },
    stream: morganStream
  })
}

// Extract, this is just an example router
function defaultRouter (/* config */) {
  const router = express.Router()

  const cors = require('cors')
  router.use(cors())

  // const compression = require('compression')
  // Middleware
  // support for Compression (Accept-Encoding: gzip|deflate)
  // as shown by: curl -i -H 'Accept-Encoding: deflate' http://0.0.0.0:8000/api/digests | wc
  // TODO(daneroo): re-enable, causing Z_BUF_ERROR for now, might try putting on app.use()
  // router.use(compression())

  // TODO(daneroo): authentication
  // router.use(function authMiddleware (req, res, next) {
  //   log.verbose('-api: should be auth\'d')
  //   next()
  // })

  // define the home page route
  router.get('/', function (req, res) {
    res.json({ you: 'Home', status: 'OK', stamp: new Date().toISOString() })
  })

  router.get('/version', function (req, res) {
    res.json(config.version)
  })
  router.get('/health', function (req, res) {
    const stamp = new Date().toISOString()
    const randomFailure = Math.random() < 0.01
    // chose 503, 4xx are client errors, and 503 is implicitly temporary
    if (randomFailure) {
      res.status(503).json({ error: 'randomly not healthy', status: 'ERROR', stamp })
    } else {
      res.json({ status: 'OK', stamp })
    }
  })

  return router
}
