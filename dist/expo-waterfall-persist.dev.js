"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var expo=require("expo"),_=_interopDefault(require("lodash")),PropTypes=_interopDefault(require("prop-types")),Log={debug:function(){console.log.apply(null,arguments)},error:function(){console.error.apply(null,arguments)}},propTypes={fileUri:PropTypes.string,debounce:PropTypes.object,onLoaded:PropTypes.func,onSaved:PropTypes.func,onSaveError:PropTypes.func,onLoadError:PropTypes.func,onVersionMismatch:PropTypes.func,onPersistedStateNotFound:PropTypes.func,onReady:PropTypes.func},defaultProps={fileUri:"".concat(expo.FileSystem.documentDirectory,"/state.json"),debounce:{wait:250,maxWait:1e3},onLoaded:function(e){var o=e.state,r=e.fileUri;Log.debug("State loaded from ".concat(r),o)},onSaved:function(e){var o=e.state,r=e.fileUri;Log.debug("State saved to ".concat(r),o)},onSaveError:function(e){var o=e.error,r=e.fileUri;throw Log.debug("Failed to save ".concat(r)),Log.error(o),o},onLoadError:function(e){var o=e.error,r=e.fileUri;throw Log.debug("Failed to load ".concat(r)),Log.error(o),o},onVersionMismatch:function(e){var o=e.oldState,r=e.newVersion;Log.debug("Version mismatch (".concat(o.version," vs ").concat(r,"). State reset."),o)},onPersistedStateNotFound:function(e){var o=e.fileUri;Log.debug("No saved state found on ".concat(o,", using defaults."))},onReady:function(){Log.debug("Provider is ready.")}};function persist(e){var o=e.setState,r=e.Provider,t=e.subscribe;r.propTypes=_.merge({},propTypes,r.propTypes),r.defaultProps=_.merge({},defaultProps,r.defaultProps);var n=r.prototype.componentWillMount;r.prototype.componentWillMount=function(){n&&n.call.apply(n,[this].concat(Array.prototype.slice.call(arguments))),this.setState({__isStateReady:!1})};var i=r.prototype.render;return r.prototype.render=function(){return this.state.__isStateReady?i.call.apply(i,[this].concat(Array.prototype.slice.call(arguments))):null},function(e,r){var n=function(e,o){if(e)return e(o)};return new Promise(function(o){expo.FileSystem.readAsStringAsync(r.props.fileUri).then(function(t){var i=JSON.parse(t);i&&i.version==e.initialState.version?(n(r.props.onLoaded,{state:i,fileUri:r.props.fileUri}),o(i)):n(r.props.onVersionMismatch,{oldState:i,newVersion:e.initialState.version}),o(e.initialState)}).catch(function(t){"E_FILE_NOT_READ"===t.code?n(r.props.onPersistedStateNotFound,{fileUri:r.props.fileUri}):n(r.props.onLoadError,{error:t,fileUri:r.props.fileUri}),o(e.initialState)})}).then(function(e){o("__persist__",e);var i=_.debounce(function(){expo.FileSystem.writeAsStringAsync(r.props.fileUri,JSON.stringify(e)).then(function(){n(r.props.onSaved,{state:e,fileUri:r.props.fileUri})}).catch(function(e){n(r.props.onSaveError,{error:e,fileUri:r.props.fileUri})})},r.props.debounce.wait,{maxWait:r.props.debounce.maxWait});t(function(o,r){_.merge(e,r),i()}),r.setState({__isStateReady:!0}),n(r.props.onReady)}),function(e){}}}exports.persist=persist;
//# sourceMappingURL=expo-waterfall-persist.dev.js.map
