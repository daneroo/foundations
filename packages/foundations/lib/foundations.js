'use strict'

const { log } = require('@daneroo/logger')

module.exports = {
  start
}

const { version } = require('../package.json')
function start () {
  console.log(`Hello @daneroo/foundations v${version}`)
  log.info('I am now using logging from @daneroo/logger')
  log.info('Start an exress server from @daneroo/server.express')
}
