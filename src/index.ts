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

  private checkGoogle204 = async () => {
    try {
      const response = await fetch('https://clients3.google.com/generate_204', {method: 'HEAD'})
      return response.ok
    } catch (e) {
      return false
    }
  }

  startListen = async (listener: (isReachable: Status) => void): Promise<boolean> => {
    this.events.push(this.eventEmitter.addListener('onNetworkChange', listener))
    const result = await Promise.race<boolean | string>([NativeModules.CheckNetwork.startListen(), new Promise(resolve => setTimeout(() => resolve('race'), 1000))])
    if (typeof result === 'boolean') return result
    return await this.checkGoogle204()

  }

  stopListen = async () => {
    this.events.forEach((e) => e.remove())
    await NativeModules.CheckNetwork.stopListen()
  }
}

export const checkNetwork = new CheckNetwork()
