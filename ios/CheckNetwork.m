#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(CheckNetwork, RCTEventEmitter)

RCT_EXTERN_METHOD(isReachable:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(startListen)
RCT_EXTERN_METHOD(stopListen)

@end
