import { FileSystem } from 'expo'
import { default as baseCreateStore } from 'react-waterfall'
import _ from 'lodash'

function createStoreAsync(config, options = {}) {
  const defaults = {
    Log: {
      debug() {
        console.log.apply(null, arguments)
      },
      error() {
        console.error.apply(null, arguments)
      }
    },
    fileUri: `${FileSystem.documentDirectory}/state.json`,
    debounce: {
      wait: 250,
      maxWait: 1000
    },
    onSaveError: e => {
      this.Log.error(e)
      throw e
    },
    onLoadError: e => {
      this.Log.error(e)
      throw e
    }
  }
  const opts = _.merge({}, defaults, options)

  return new Promise((resolve, reject) => {
    const { fileUri, Log, onLoadError, onSaveError } = opts
    Log.debug(`Loading state from ${fileUri}`)
    new Promise((resolve, reject) => {
      FileSystem.readAsStringAsync(fileUri)
        .then(s => {
          let state = JSON.parse(s)
          if (!state || state.version != config.initialState.version) {
            Log.debug(
              `State verison differs (${state.version} vs ${
                config.initialState.version
              }, discarding.`
            )
          } else {
            Log.debug('State restored', state)
            config.initialState = { ...state }
          }

          resolve(config)
        })
        .catch(e => {
          if (e.code === 'E_FILE_NOT_READ') {
            Log.debug('No saved state found, using defaults.')
          } else {
            onLoadError(e)
          }
          resolve(config)
        })
    }).then(config => {
      let stateMirror = _.merge({}, config.initialState)
      Log.debug('Waterfall Config', config)
      const Waterfall = baseCreateStore(config)

      let save = _.debounce(
        () => {
          FileSystem.writeAsStringAsync(fileUri, JSON.stringify(stateMirror))
            .then(() => {
              Log.debug('State persisted', stateMirror)
            })
            .catch(onSaveError)
        },
        opts.debounce.wait,
        { maxWait: opts.debounce.maxWait }
      )
      Waterfall.subscribe(function(actionName, stateFragmentResult) {
        Log.debug('saved to mirror', stateFragmentResult)
        _.merge(stateMirror, stateFragmentResult)
        save()
      })
      resolve(Waterfall)
    })
  })
}

export { createStoreAsync }
