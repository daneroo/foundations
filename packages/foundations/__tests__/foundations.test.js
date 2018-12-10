'use strict'

const foundations = require('..')

describe('@daneroo/foundations', () => {
  it('invokes the start function', async () => {
    await foundations.start()
    expect(1).toEqual(1)
  })
})
