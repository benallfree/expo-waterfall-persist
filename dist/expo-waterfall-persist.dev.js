"use strict";function _interopDefault(e){return e&&"object"==typeof e&&"default"in e?e.default:e}Object.defineProperty(exports,"__esModule",{value:!0});var expo=require("expo"),baseCreateStore=_interopDefault(require("react-waterfall")),_=_interopDefault(require("lodash"));function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),n.forEach(function(t){_defineProperty(e,t,r[t])})}return e}function createStoreAsync(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=function(){console.log.apply(null,arguments)},n=function(){console.error.apply(null,arguments)},o={fileUri:"".concat(expo.FileSystem.documentDirectory,"/state.json"),debounce:{wait:250,maxWait:1e3},onLoaded:function(e){var t=e.state,n=e.fileUri;r("State loaded from ".concat(n),t)},onSaved:function(e,t){r("State saved to ".concat(t),e)},onSaveError:function(e){var t=e.error,o=e.fileUri;throw r("Failed to save ".concat(o)),n(t),t},onLoadError:function(e){var t=e.error,o=e.fileUri;throw r("Failed to load ".concat(o)),n(t),t},onVersionMismatch:function(e){var t=e.oldState,n=e.newVersion;r("Version mismatch (".concat(t.version," vs ").concat(n,"). State reset."),t)},onPersistedStateNotFound:function(e){var t=e.fileUri;r("No saved state found on ".concat(t,", using defaults."))}},i=_.merge({},o,t);return new Promise(function(t,r){var n=i.fileUri,o=i.onLoadError,a=i.onSaveError,c=i.onSaved,s=i.onVersionMismatch,u=i.onLoaded,l=i.onPersistedStateNotFound;new Promise(function(t,r){expo.FileSystem.readAsStringAsync(n).then(function(r){var o=JSON.parse(r);o&&o.version==e.initialState.version?(u({state:o,fileUri:n}),e.initialState=_objectSpread({},o)):s({oldState:o,newVersion:e.initialState.version}),t(e)}).catch(function(r){"E_FILE_NOT_READ"===r.code?l({fileUri:n}):o({error:r,fileUri:n}),t(e)})}).then(function(e){var r=_.merge({},e.initialState),o=baseCreateStore(e),s=_.debounce(function(){expo.FileSystem.writeAsStringAsync(n,JSON.stringify(r)).then(function(){c({state:r,fileUri:n})}).catch(function(e){a({error:e,fileUri:n})})},i.debounce.wait,{maxWait:i.debounce.maxWait});o.subscribe(function(e,t){_.merge(r,t),s()}),t(o)})})}exports.createStoreAsync=createStoreAsync;
//# sourceMappingURL=expo-waterfall-persist.dev.js.map
