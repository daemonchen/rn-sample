//
//  UMengManager.m
//  awesomeMobile
//
//  Created by 陈光远 on 16/1/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "UMengManager.h"

#import "RCTBridge.h"

@implementation UMengManager

@synthesize bridge = _bridge;

-(void)shareToSns:(NSDictionary *)aData callBack:(RCTResponseSenderBlock)callback{
  UIViewController *vc = [[[[UIApplication sharedApplication] delegate] window] rootViewController];

  self.callback = callback;
  //设置分享的点击链接
//
//  [UMSocialData defaultData].extConfig.wechatSessionData.url = aData[@"url"];
//  [UMSocialData defaultData].extConfig.wechatTimelineData.url =aData[@"url"];
  dispatch_async(dispatch_get_main_queue(), ^{
    [UMSocialSnsService presentSnsIconSheetView:vc
                                         appKey:UmengAppkey
                                      shareText:aData[@"text"]
//                                      shareText:shareText
//                                     shareImage:[UIImage image]
//                                     shareImage:aData[@"image"]
                                     shareImage:nil
                                shareToSnsNames:[NSArray arrayWithObjects:UMShareToSina,UMShareToWechatSession,UMShareToWechatTimeline,
                                                 UMShareToWechatFavorite,UMShareToQQ,nil]
//                                shareToSnsNames:nil
                                       delegate:self];
  });
  
}

//实现回调方法（可选）:
-(void)didFinishGetUMSocialDataInViewController:(UMSocialResponseEntity *)response
{
  //根据`responseCode`得到发送结果,如果分享成功
  if(response.responseCode == UMSResponseCodeSuccess)
  {
    //得到分享到的微博平台名
    self.callback(@[response.data]);
//    NSLog(@"-------share to sns name is %@",[[response.data allKeys] objectAtIndex:0]);
  }
}

RCT_EXPORT_MODULE();


RCT_EXPORT_METHOD(presentSnsIconSheetView:(NSDictionary *)data callback:(RCTResponseSenderBlock) callback)
{

  [self shareToSns:data callBack:callback];
  
}

@end