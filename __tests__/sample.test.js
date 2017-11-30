'use strict'
require('./bootstrap')

describe('Transport', function () {
  beforeEach(() => {
    expect(true).toBeTruthy()
  })
  it('can test something', function () {
    expect({ a: 1, b: { c: 1 } }).toMatchObject({ b: { c: 1 } })
  })

  it('can test something async', async function () {
    return new Promise((resolve, reject) => {
      expect({ a: 1, b: { c: 1 } }).toMatchObject({ b: { c: 1 } })
      resolve()
    })
  })

  it('can test throws async', async function () {
    return expect(new Promise((resolve, reject) => {
      throw new Error('Hello world')
    })).rejects.toBeInstanceOf(Error)
  })
})
