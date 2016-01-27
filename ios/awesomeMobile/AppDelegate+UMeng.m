//
//  AppDelegate+UMeng.m
//  awesomeMobile
//
//  Created by 陈光远 on 16/1/26.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "AppDelegate+UMeng.h"

//#import "UMSocialYixinHandler.h"
//#import "UMSocialFacebookHandler.h"
//#import "UMSocialLaiwangHandler.h"
#import "UMSocialWechatHandler.h"
//#import "UMSocialTwitterHandler.h"
#import "UMSocialQQHandler.h"
//#import "UMSocialSinaHandler.h"
//#import "UMSocialSinaSSOHandler.h"
//#import "UMSocialTencentWeiboHandler.h"
//#import "UMSocialRenrenHandler.h"

//#import "UMSocialInstagramHandler.h"
//#import "UMSocialWhatsappHandler.h"
//#import "UMSocialLineHandler.h"
//#import "UMSocialTumblrHandler.h"
//#import "UMSocialAlipayShareHandler.h"

@implementation AppDelegate (UMeng)

- (void)registerUMeng
{
  //设置友盟社会化组件appkey
  [UMSocialData setAppKey:UmengAppkey];
  
  //打开调试log的开关
//  [UMSocialData openLog:YES];
  
  //设置微信AppId，设置分享url，默认使用友盟的网址
  [UMSocialWechatHandler setWXAppId:@"wxe24bfa066ee2d597" appSecret:@"83aa4722b81a03f42daae1c9dfe890ad" url:@"http://www.nzaom.com"];
  
  // 打开新浪微博的SSO开关
  // 将在新浪微博注册的应用appkey、redirectURL替换下面参数，并在info.plist的URL Scheme中相应添加wb+appkey，如"wb3921700954"，详情请参考官方文档。
//  [UMSocialSinaSSOHandler openNewSinaSSOWithAppKey:@"3921700954"
//                                       RedirectURL:@"http://sns.whalecloud.com/sina2/callback"];
  
    //设置分享到QQ空间的应用Id，和分享url 链接
//  [UMSocialQQHandler setQQWithAppId:@"100424468" appKey:@"c7394704798a158208a74ab60104f0ba" url:@"http://www.umeng.com/social"];
  //    //设置支持没有客户端情况下使用SSO授权
//  [UMSocialQQHandler setSupportWebView:YES];
  
   [UMSocialConfig hiddenNotInstallPlatforms:@[UMShareToQQ,UMShareToQzone,UMShareToWechatTimeline]];
  
  //使用友盟统计
//  [MobClick startWithAppkey:UmengAppkey];

  NSLog(@"-------registerUMeng");
}


@end
