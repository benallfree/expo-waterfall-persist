'use strict'
require('./bootstrap')

describe('Transport', function () {
  beforeEach(() => {
    assert.isTrue(true)
  })
  it('can test something', function () {
    assert.containSubset({ a: 1, b: { c: 1 } }, { b: { c: 1 } })
  })

  it('can test something async', async function () {
    return new Promise((resolve, reject) => {
      assert.containSubset({ a: 1, b: { c: 1 } }, { b: { c: 1 } })
      resolve()
    })
  })

  it('can test throws async', async function () {
    return assert.throwsAsync(async ()=>{
      return new Promise((resolve, reject) => {
        throw new Error("Hello world")
      })
    }, Error)
  })

})
