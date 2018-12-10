# `@daneroo/logger`

Quick setup of of a winston logger, configured as I like it!

## TODO

- Determine usage patterns (in code, findAll in scrobbleCast/qcic)

## Usage - quick

```bash
const { log } = require('@daneroo/logger')
log.info('Yo')
```

## Usage - configured

```bash
const { createLogger } = require('@daneroo/logger')
const log = createLogger({ color: true, level: 'debug', padded: true, local: true, short: true })

log.info('Yo ho, with options')
```

## Usage - multiple transports

```bash
const winston = require('winston')
const { transport } = require('@daneroo/logger')

const log = winston.createLogger({
  transports: [
    transport.console({ color: true, level: 'debug', padded: true, local: false, short: false }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

log.info('Yo ho, combined with other logger')
```
