if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/expo-waterfall-persist.min.js')
} else {
  module.exports = require('./dist/expo-waterfall-persist.dev.js')
}
