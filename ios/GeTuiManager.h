//
//  GeTuiManager.h
//  awesomeMobile
//
//  Created by scott on 15/12/16.
//  Copyright © 2015年 Facebook. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@interface GeTuiManager : NSObject <RCTBridgeModule>

+(void) setClientId:(NSString *)newClientId;
@end
