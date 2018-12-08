'use strict'

const foundations = require('..')

describe('@daneroo/foundations', () => {
  it('invokes the main function', () => {
    foundations.start()
    expect(1).toEqual(1)
  })
})
