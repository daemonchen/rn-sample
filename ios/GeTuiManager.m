//
//  GeTuiManager.m
//  awesomeMobile
//
//  Created by scott on 15/12/16.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "GeTuiManager.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@implementation GeTuiManager

@synthesize bridge = _bridge;

static NSString *_ClientId = @"";

+(void)setClientId:(NSString *)newClientId
{
//  NSString *clientIdString = [NSString stringWithString:clientId];
  _ClientId = newClientId;
}

+ (instancetype)sharedInstance {
  static GeTuiManager *sharedInstance = nil;
  
  sharedInstance = [[self alloc] init];
  
  return sharedInstance;
}

- (instancetype)init {
  self = [super init];
  return self;
}

- (void)handleRemoteNotificationReceived:(NSString *)payloadMsg withRoot:(RCTRootView *)rootView
{
  GeTuiManager *geTuiManager = [rootView.bridge moduleForClass:[GeTuiManager class]];
  NSLog(@"-------GeTuiManager trigger event nzaomNotify with data %@", payloadMsg);
//  [self.bridge.eventDispatcher sendAppEventWithName:@"nzaomNotify" body:payloadMsg];
  
  [geTuiManager.bridge.eventDispatcher sendAppEventWithName:@"nzaomNotify" body:payloadMsg];
}

RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(getClientId:(RCTResponseSenderBlock) callback)
{
  callback(@[_ClientId]);
}

@end
