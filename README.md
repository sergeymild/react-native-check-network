# react-native-check-network

Check network accessability

## Installation

```sh
"react-native-check-network":"sergeymild/react-native-check-network#1.0.0"
```

## Usage

```js
import {checkNetwork} from 'react-native-check-network'

// ...

let isNetworkAvailable = await checkNetwork.startListen((s) => {
    // update availability in realtime
    isNetworkAvailable = s.isReachable
})

// later in code
await checkNetwork.stopListen()
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT
