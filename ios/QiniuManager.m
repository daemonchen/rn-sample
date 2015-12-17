//
//  QiniuManager.m
//  awesomeMobile
//
//  Created by scott on 15/12/17.
//  Copyright © 2015年 Facebook. All rights reserved.
//

#import "QiniuManager.h"
#import "RCTBridge.h"

@implementation QiniuManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(uploadToQiniu:(NSString *)uri
                  key:(NSString *)key
                  token:(NSString *)token
                  params:(NSDictionary*)params
                  callback:(RCTResponseSenderBlock)callback)
{
  QNUploadManager *upManager = [[QNUploadManager alloc] init];
//  NSData *imageData = [NSData dataWithContentsOfFile: finalPath];
  NSData *data = [NSData dataWithContentsOfFile: uri];
  
  QNUploadOption *opt = [[QNUploadOption alloc] initWithMime:@"text/plain" progressHandler:nil params:params checkCrc:YES cancellationSignal:nil];
  
  [upManager putData:data key:key token:token
            complete: ^(QNResponseInfo *info, NSString *key, NSDictionary *resp) {
              callback(@[info]);
              NSLog(@"%@", info);
              NSLog(@"%@", resp);
            } option:opt];
  
}

@end
