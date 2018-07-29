import { FileSystem } from 'expo'
import _ from 'lodash'
import PropTypes from 'prop-types'

const Log = {
  debug() {
    console.log.apply(null, arguments)
  },
  error() {
    console.error.apply(null, arguments)
  }
}

const propTypes = {
  fileUri: PropTypes.string,
  debounce: PropTypes.object,
  onLoaded: PropTypes.func,
  onSaved: PropTypes.func,
  onSaveError: PropTypes.func,
  onLoadError: PropTypes.func,
  onVersionMismatch: PropTypes.func,
  onPersistedStateNotFound: PropTypes.func,
  onReady: PropTypes.func
}

const defaultProps = {
  fileUri: `${FileSystem.documentDirectory}/state.json`,
  debounce: {
    wait: 250,
    maxWait: 1000
  },
  onLoaded({ state, fileUri }) {
    Log.debug(`State loaded from ${fileUri}`, state)
  },
  onSaved({ state, fileUri }) {
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
  },
  onReady() {
    Log.debug('Provider is ready.')
  }
}

function persist({ setState, Provider, subscribe }) {
  Provider.propTypes = _.merge({}, propTypes, Provider.propTypes)
  Provider.defaultProps = _.merge({}, defaultProps, Provider.defaultProps)
  let oldComponentWillMount = Provider.prototype.componentWillMount
  Provider.prototype.componentWillMount = function() {
    if (oldComponentWillMount) oldComponentWillMount.call(this, ...arguments)
    this.setState({ __isStateReady: false })
  }
  let oldRender = Provider.prototype.render
  Provider.prototype.render = function() {
    if (!this.state.__isStateReady) return null
    return oldRender.call(this, ...arguments)
  }

  return function(config, providerInstance) {
    let tryCall = function(func, args) {
      if (!func) return
      return func(args)
    }

    new Promise(resolve => {
      FileSystem.readAsStringAsync(providerInstance.props.fileUri)
        .then(s => {
          let state = JSON.parse(s)
          if (!state || state.version != config.initialState.version) {
            tryCall(providerInstance.props.onVersionMismatch, {
              oldState: state,
              newVersion: config.initialState.version
            })
          } else {
            tryCall(providerInstance.props.onLoaded, {
              state,
              fileUri: providerInstance.props.fileUri
            })
            resolve(state)
          }
          resolve(config.initialState)
        })
        .catch(error => {
          if (error.code === 'E_FILE_NOT_READ') {
            tryCall(providerInstance.props.onPersistedStateNotFound, {
              fileUri: providerInstance.props.fileUri
            })
          } else {
            tryCall(providerInstance.props.onLoadError, {
              error,
              fileUri: providerInstance.props.fileUri
            })
          }
          resolve(config.initialState)
        })
    }).then(stateMirror => {
      setState('__persist__', stateMirror)
      let save = _.debounce(
        () => {
          FileSystem.writeAsStringAsync(
            providerInstance.props.fileUri,
            JSON.stringify(stateMirror)
          )
            .then(() => {
              tryCall(providerInstance.props.onSaved, {
                state: stateMirror,
                fileUri: providerInstance.props.fileUri
              })
            })
            .catch(error => {
              tryCall(providerInstance.props.onSaveError, {
                error,
                fileUri: providerInstance.props.fileUri
              })
            })
        },
        providerInstance.props.debounce.wait,
        { maxWait: providerInstance.props.debounce.maxWait }
      )
      subscribe(function(actionName, stateFragmentResult) {
        _.merge(stateMirror, stateFragmentResult)
        save()
      })
      providerInstance.setState({ __isStateReady: true })
      tryCall(providerInstance.props.onReady)
    })
    return function(action, ...args) {
      // noop
    }
  }
}

export { persist }
