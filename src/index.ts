import {
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from 'react-native'

export interface Status {
  isReachable: boolean
}

interface CheckNetworkType {
  isReachable(): Promise<boolean>
  startListen(listener: (isReachable: Status) => void): void
  stopListen(): void
}

class CheckNetwork implements CheckNetworkType {
  private eventEmitter = new NativeEventEmitter(NativeModules.CheckNetwork)
  private events: Array<EmitterSubscription> = []

  isReachable = async (): Promise<boolean> => {
    return await NativeModules.CheckNetwork.isReachable()
  }

  onNetworkChange = () => {}

  startListen = async (listener: (isReachable: Status) => void): Promise<boolean> => {
    this.events.push(this.eventEmitter.addListener('onNetworkChange', listener))
    return await NativeModules.CheckNetwork.startListen()
  }

  stopListen = async () => {
    this.events.forEach((e) => e.remove())
    await NativeModules.CheckNetwork.stopListen()
  }
}

export const checkNetwork = new CheckNetwork()
