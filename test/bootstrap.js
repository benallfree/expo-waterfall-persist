const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const chaiThrowAsync = require('@miriamjs/chai-throw-async')
chai.use(chaiThrowAsync)
const assert = chai.assert

global.assert = chai.assert

const { ServiceManager } = require('@miriamjs/ioc')

ServiceManager.reset()
let shouldLog = false
ServiceManager.register('Log', function () {
  return {
    info: function () {
      if (!shouldLog) return
      Array.prototype.unshift.call(arguments, '<info>'); console.log.apply(console, arguments)
    },
    error: function () {
      if (!shouldLog) return
      Array.prototype.unshift.call(arguments, '<ERROR>'); console.log.apply(console, arguments)
    }
  }
})
