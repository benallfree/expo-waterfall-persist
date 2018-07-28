# expo-waterfall-persist

`expo-waterfall-persist` is A persistent state storage extension for react-waterfall running in Expo.

`react-waterfall` is an amazingly easy-to-use state management package for React. You can use `expo-waterfall-react` to automagically store and retrieve Waterfall state in your Expo (React Native) app.

```
npm install expo-waterfall-persist
```

# Usage

```
import { createStoreAsync } from 'expo-waterfall-persist'

const Greeting = ()=>(<Text>{this.props.greeting}</Text>)

class App extends Component {
  conig = {
    initialState: {greeting: 'Hello world'},
    actionsCreators: {
      setGreeting: (state, actions, greeting)=>({ greeting})
    }
  }

  state: {
    isLoaded: false
  }


  componentDidMount() {
    createStoreAsync(this.config).then( ( { Provider, actions, connect, subscribe, unsubscribe } )=>{
      this.Provider = Provider
      this.Greeting = connect({greeting}=>{greeting})(Greeting)
      this.setState({isLoaded: true})
    })
  }

  render() {
    if (!this.state.isLoaded) return null

    return (
      <this.Provider>
        <this.Greeting/>
      </this.Provider>
    )
  }
}
```
