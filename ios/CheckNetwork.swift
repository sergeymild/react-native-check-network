import Foundation
import React

@objc(CheckNetwork)
class CheckNetwork: RCTEventEmitter {
    private let onNetworkChangeEventName = "onNetworkChange"
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["onNetworkChange"]
    }

    private var hasListeners = false
    let networkManager = NetworkReachabilityManager()
    
    override func startObserving() { hasListeners = true }
    override func stopObserving() { hasListeners = false }
    
    @objc
    func startListen(
        _ resolver: @escaping RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) {
        var didResolved = false
        networkManager?.listener = { [weak self] status in
            guard let self else { return }
            debugPrint("networkManager?.listener", self.hasListeners, status)
            if !self.hasListeners { return }
            switch status {
            case .notReachable:
                let body = ["isReachable": false]
                self.sendEvent(withName: self.onNetworkChangeEventName, body: body)
                if !didResolved { resolver(false) }
            case .reachable:
                let body = ["isReachable": true]
                self.sendEvent(withName: self.onNetworkChangeEventName, body: body)
                if !didResolved { resolver(true) }
            case .unknown:
                let body = ["isReachable": false]
                self.sendEvent(withName: self.onNetworkChangeEventName, body: body)
                if !didResolved { resolver(false) }
            }
            didResolved = true
        }
        networkManager?.startListening()
    }
    
    @objc
    func stopListen(
        _ resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) {
        networkManager?.listener = nil
        networkManager?.stopListening()
        resolver(nil)
    }
    
    @objc
    func isReachable(
        _ resolver: RCTPromiseResolveBlock,
        rejecter: RCTPromiseRejectBlock
    ) {
        resolver(networkManager?.isReachable == true)
    }
}
