//
//  GeTuiManager.m
//  awesomeMobile
//
//  Created by scott on 15/12/16.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "GeTuiManager.h"
#import "RCTBridge.h"

@implementation GeTuiManager

static NSString *_ClientId = @"";

+(void)setClientId:(NSString *)newClientId
{
//  NSString *clientIdString = [NSString stringWithString:clientId];
  _ClientId = newClientId;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getClientId:(RCTResponseSenderBlock) callback)
{
  callback(@[_ClientId]);
}

@end
