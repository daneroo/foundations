'use strict'

const server = require('..')
const { express } = server

describe('@daneroo/server', () => {
  describe('express', () => {
    test('server has express component', () => {
      expect(server).toHaveProperty('express')
    })
    test('express has start method', () => {
      expect(server).toHaveProperty('express.start')
      expect(express).toHaveProperty('start')
      expect(typeof express.start).toEqual('function')
    })
  })
})
