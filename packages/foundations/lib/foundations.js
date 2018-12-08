'use strict'

module.exports = {
  start
}

const { version } = require('../package.json')
function start () {
  console.log(`Hello @daneroo/foundations v${version}`)
}
