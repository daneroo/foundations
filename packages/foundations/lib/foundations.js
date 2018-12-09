'use strict'

const { log } = require('@daneroo/logger')
const { express } = require('@daneroo/server')

module.exports = {
  start
}

const { version } = require('../package.json')
async function start () {
  console.log(`Hello @daneroo/foundations v${version}`)
  log.info('I am now using logging from @daneroo/logger')
  log.info('Starting an express server from @daneroo/server.express')
  express.start()
  log.info('Stopping the express server')
  await delay(10000)
  express.stop()
  log.info('Stopped the express server')
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
