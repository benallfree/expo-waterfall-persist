# expo-waterfall-persist

## [Run the demo on Expo.io](https://exp.host/@benallfree/expo-waterfall-persist-demo) / [Clone the demo](/benallfree/expo-waterfall-persist-demo)

`expo-waterfall-persist` is persistent storage middleware for [react-waterfall](/didierfranc/react-waterfall), for Expo apps.

![demo](https://thumbs.gfycat.com/WhitePaleEquine-size_restricted.gif)

## Installation

```
npm install expo-waterfall-persist
npm install git://github.com/benallfree/react-waterfall.git#master
```

Note: a fork of `react-waterfall` is required temporarily. See Discussion below.

## Usage

```js
import { persist } from 'expo-waterfall-persist'
const { Provider } = createStore(config, [persist])

export default () => <Provider onSaved={() => console.log('saved')} />
```

The magic is in the middleware. By supplying the `persist` middleware to `createStore`, you enable state persistance and status callbacks on the `Provider`.

`Provider` accepts several new props when the `persist` middleware is installed:

_Props:_

`fileUri` (default `${FileSystem.documentDirectory}/state.json`) The path to the file used to persist state. See [Expo FileSystem](https://docs.expo.io/versions/latest/sdk/filesystem) for details.

`debounce` (default `{wait: 250, maxWait: 1000}`) Debounce is used to prevent state from saving too rapidly. By default, it will wait at leaste 250ms before saving, but it will save at least every 1s if things have changed.

`onLoaded({ state, fileUri })` Called when state has been restored from persistant storage.

`onSaved({state, fileUri})` Called when state is saved to persistent storage.

`onSaveError({ error, fileUri })` Critically bad news. Called when state fails to save to persistent storage.

`onLoadError({ error, fileUri })` Fairly bad news. Called when state fails to load from persistant storage due to some error other than 'file not found'. Default state used instead.

`onVersionMismatch({ oldState, newVersion })` Harmless. Called when persisted state version does not match current version specified in `config`, and the default state is used instead. State versioning is an optional but useful feature if you issue an app update that makes previously persisted states incompatible.

`onPersistedStateNotFound({ fileUri })` Harmless. Called when persistent state is not present. Harmless, uses default state.

## More Complete Example

See [expo-waterfall-persist-demo](/benallfre/expo-waterfall-persist-demo) for a working example.

```jsx
import React from 'react'
import { Text, View } from 'react-native'
import createStore from 'react-waterfall'
import { persist } from 'expo-waterfall-persist'

const config = {
  initialState: { version: 1, tick: 0 },
  actionsCreators: {
    tick: ({ tick }) => ({
      tick: tick + 1
    })
  }
}

// Here's the magic! The `persist` middleware
const { Provider, actions, connect } = createStore(config, [persist])

const ShowTick = connect(({ tick }) => ({ tick }))(({ tick }) => (
  <Text>{tick}</Text>
))

export default class App extends React.Component {
  componentWillMount() {
    setInterval(() => {
      actions.tick()
    }, 50)
  }

  handleStateSaved = state => {
    console.log('The state was persisted.', state)
  }

  render() {
    return (
      <View>
        <Provider onSaved={this.handleStateSaved}>
          <ShowTick />
        </Provider>
      </View>
    )
  }
}
```

## Discussion

Making this package work has required a temporary fork of `react-waterfall`. I needed to update the middleware strategy so that middleware was capable of modifying `createStore` initializers as well as setting state of the store without forcing the user to create an action or polluting the `actionsCreators` structure.

Due to the asynchronous nature of loading/saving persistent state in the Expo filesystem, this package will not render the children of `Provider` until state has resolved either to the persisted state or the default state if persisted state fails to load.
