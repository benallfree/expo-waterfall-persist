import { FileSystem } from 'expo'
import { default as baseCreateStore } from 'react-waterfall'
import _ from 'lodash'

function createStoreAsync(config, options = {}) {
  const Log = {
    debug() {
      console.log.apply(null, arguments)
    },
    error() {
      console.error.apply(null, arguments)
    }
  }

  const defaults = {
    fileUri: `${FileSystem.documentDirectory}/state.json`,
    debounce: {
      wait: 250,
      maxWait: 1000
    },
    onLoaded({ state, fileUri }) {
      Log.debug(`State loaded from ${fileUri}`, state)
    },
    onSaved(state, fileUri) {
      Log.debug(`State saved to ${fileUri}`, state)
    },
    onSaveError({ error, fileUri }) {
      Log.debug(`Failed to save ${fileUri}`)
      Log.error(error)
      throw error
    },
    onLoadError({ error, fileUri }) {
      Log.debug(`Failed to load ${fileUri}`)
      Log.error(error)
      throw error
    },
    onVersionMismatch({ oldState, newVersion }) {
      Log.debug(
        `Version mismatch (${oldState.version} vs ${newVersion}). State reset.`,
        oldState
      )
    },
    onPersistedStateNotFound({ fileUri }) {
      Log.debug(`No saved state found on ${fileUri}, using defaults.`)
    }
  }
  const opts = _.merge({}, defaults, options)

  return new Promise((resolve, reject) => {
    const {
      fileUri,
      onLoadError,
      onSaveError,
      onSaved,
      onVersionMismatch,
      onLoaded,
      onPersistedStateNotFound
    } = opts
    new Promise((resolve, reject) => {
      FileSystem.readAsStringAsync(fileUri)
        .then(s => {
          let state = JSON.parse(s)
          if (!state || state.version != config.initialState.version) {
            onVersionMismatch({
              oldState: state,
              newVersion: config.initialState.version
            })
          } else {
            onLoaded({ state, fileUri })
            config.initialState = { ...state }
          }

          resolve(config)
        })
        .catch(error => {
          if (error.code === 'E_FILE_NOT_READ') {
            onPersistedStateNotFound({ fileUri })
          } else {
            onLoadError({ error, fileUri })
          }
          resolve(config)
        })
    }).then(config => {
      let stateMirror = _.merge({}, config.initialState)
      const Waterfall = baseCreateStore(config)

      let save = _.debounce(
        () => {
          FileSystem.writeAsStringAsync(fileUri, JSON.stringify(stateMirror))
            .then(() => {
              onSaved({ state: stateMirror, fileUri })
            })
            .catch(error => {
              onSaveError({ error, fileUri })
            })
        },
        opts.debounce.wait,
        { maxWait: opts.debounce.maxWait }
      )
      Waterfall.subscribe(function(actionName, stateFragmentResult) {
        _.merge(stateMirror, stateFragmentResult)
        save()
      })
      resolve(Waterfall)
    })
  })
}

export { createStoreAsync }
