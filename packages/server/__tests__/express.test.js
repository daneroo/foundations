'use strict'

const server = require('..')
const { express } = server
const request = require('supertest')

describe('@daneroo/server', () => {
  describe('express', () => {
    test('server has express component', () => {
      expect(server).toHaveProperty('express')
    })
    test.each([
      'start',
      'stop',
      'newServer'
    ])('express has %s method', (method) => {
      expect(express).toHaveProperty(method)
      expect(typeof express[method]).toEqual('function')
    })
  })

  describe('express integration', () => {
    test('It should respond to GET /', async () => {
      // setup
      const { app } = express.newServer()
      app.get('/', (req, res) => {
        res.json({ key: 'value' })
      })

      // invoke
      const response = await request(app).get('/')
      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toEqual(expect.stringMatching(/^application\/json/))
      expect(response.body).toEqual({ key: 'value' })
    })
  })

  describe('defaultRouter', () => {
    test('It should respond to GET /', async () => {
      // setup
      const { app } = express.newServer()
      app.use(express.defaultRouter())

      // invoke
      const response = await request(app).get('/')

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toEqual(expect.stringMatching(/^application\/json/))
      expect(response.body).toEqual(expect.objectContaining({
        you: 'Home',
        status: 'OK',
        stamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      }))
    })
  })

  describe('handlers', () => {
    test.each([
      ['slashHandler', express.slashHandler, expect.objectContaining({
        you: 'Home',
        status: 'OK',
        stamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      })],
      ['versionHandler', express.versionHandler,
        expect.stringMatching(/^\d*.\d*.\d*$/)
      ],
      ['healthHandler', express.healthHandler, expect.objectContaining({
        status: 'OK',
        stamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
      })]
    ])('%s', async (name, handler, expected) => {
      // setup
      const { app } = express.newServer()
      app.get('/theroute', handler)

      // invoke
      const response = await request(app).get('/theroute')

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toEqual(expect.stringMatching(/^application\/json/))
      expect(response.body).toEqual(expected)
    })
  })
})
