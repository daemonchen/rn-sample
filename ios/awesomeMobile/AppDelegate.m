/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTRootView.h"
#import "RCTLinkingManager.h"
#import "RCTPushNotificationManager.h"
#import "GeTuiManager.h"
#import "AppDelegate+UMeng.h"

@interface AppDelegate ()

@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  NSURL *jsCodeLocation;

  
  jsCodeLocation = [NSURL URLWithString:@"http://192.168.1.119:8081/index.ios.bundle?platform=ios&dev=true"];

//   jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"awesomeMobile"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  self.rootView = rootView;
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [[UIViewController alloc] init];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  // 通过 appId、 appKey 、appSecret 启动SDK，注：该方法需要在主线程中调用
  [GeTuiSdk startSdkWithAppId:kGtAppId appKey:kGtAppKey appSecret:kGtAppSecret delegate:self];
  
  // 注册APNS
  [self registerUserNotification];
  
  // 处理远程通知启动APP
  [self receiveNotificationByLaunchingOptions:launchOptions];
  
  //注册umeng
  [self registerUMeng];
  
  return YES;
}


#pragma mark - 用户通知(推送) _自定义方法

/** 注册用户通知 */
- (void)registerUserNotification {
  
  /*
   注册通知(推送)
   申请App需要接受来自服务商提供推送消息
   */
  // 判读系统版本是否是“iOS 8.0”以上
  if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0 ||
      [UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]) {
    
    // 定义用户通知类型(Remote.远程 - Badge.标记 Alert.提示 Sound.声音)
    UIUserNotificationType types = UIUserNotificationTypeAlert | UIUserNotificationTypeBadge | UIUserNotificationTypeSound;
    
    // 定义用户通知设置
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:types categories:nil];
    
    // 注册用户通知 - 根据用户通知设置
    [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
    
//    NSLog(@"----did registerUserNotificationSettings as ios version > 8.0");

  }
  else {      // iOS8.0 以前远程推送设置方式
    // 定义远程通知类型(Remote.远程 - Badge.标记 Alert.提示 Sound.声音)
    UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound;
    
    // 注册远程通知 -根据远程通知类型
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:myTypes];
    [[UIApplication sharedApplication] registerForRemoteNotifications];
//    NSLog(@"----did registerUserNotificationSettings as ios version < 8.0");
  }
}

/** 自定义：APP被“推送”启动时处理推送消息处理（APP 未启动--》启动）*/
- (void)receiveNotificationByLaunchingOptions:(NSDictionary *)launchOptions {
  if (!launchOptions) return;
  
  /*
   通过“远程推送”启动APP
   UIApplicationLaunchOptionsRemoteNotificationKey 远程推送Key
   */
  NSDictionary *userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
  if (userInfo) {
    NSLog(@"\n>>>[Launching RemoteNotification]:%@",userInfo);
  }
}

#pragma mark - 远程通知(推送)回调

/** 远程通知注册成功委托 */
// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  
  NSString *myToken = [[deviceToken description] stringByTrimmingCharactersInSet:[NSCharacterSet characterSetWithCharactersInString:@"<>"]];
  myToken = [myToken stringByReplacingOccurrencesOfString:@" " withString:@""];
  NSLog(@"\n>>>[DeviceToken ]:%@\n\n",deviceToken);
  
  [GeTuiSdk registerDeviceToken:myToken];
  
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

/** 远程通知注册失败委托 */
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  
  [GeTuiSdk registerDeviceToken:@""];
  
  NSLog(@"\n>>>[DeviceToken Error]:%@\n\n",error.description);
}

#pragma mark - APP运行中接收到通知(推送)处理

// Required for the notification event.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}

/** SDK启动成功返回cid */
- (void)GeTuiSdkDidRegisterClient:(NSString *)clientId {
  // [4-EXT-1]: 个推SDK已注册，返回clientId
  [GeTuiManager setClientId:clientId];
}

/** SDK遇到错误回调 */
- (void)GeTuiSdkDidOccurError:(NSError *)error {
  // [EXT]:个推错误报告，集成步骤发生的任何错误都在这里通知，如果集成后，无法正常收到消息，查看这里的通知。
  NSLog(@"\n>>>[GexinSdk error]:%@\n\n", [error localizedDescription]);
}


/** SDK收到透传消息回调 */
- (void)GeTuiSdkDidReceivePayload:(NSString *)payloadId andTaskId:(NSString *)taskId andMessageId:(NSString *)aMsgId andOffLine:(BOOL)offLine fromApplication:(NSString *)appId {
  
  // [4]: 收到个推消息
  NSData *payload = [GeTuiSdk retrivePayloadById:payloadId];
  NSString *payloadMsg = nil;
  if (payload) {
    payloadMsg = [[NSString alloc] initWithBytes:payload.bytes length:payload.length encoding:NSUTF8StringEncoding];
  }
  
//  NSString *msg = [NSString stringWithFormat:@" payloadId=%@,taskId=%@,messageId:%@,payloadMsg:%@%@",payloadId,taskId,aMsgId,payloadMsg,offLine ? @"<离线消息>" : @""];
    NSLog(@"\n>>>[GexinSdk ReceivePayload]:%@\n\n", payloadMsg);
    GeTuiManager *geTuiManager = [GeTuiManager sharedInstance];
  [geTuiManager handleRemoteNotificationReceived:payloadMsg withRoot:self.rootView];
  /**
   *汇报个推自定义事件
   *actionId：用户自定义的actionid，int类型，取值90001-90999。
   *taskId：下发任务的任务ID。
   *msgId： 下发任务的消息ID。
   *返回值：BOOL，YES表示该命令已经提交，NO表示该命令未提交成功。注：该结果不代表服务器收到该条命令
   **/
  [GeTuiSdk sendFeedbackMessage:90001 taskId:taskId msgId:aMsgId];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
  return [RCTLinkingManager application:application openURL:url
                      sourceApplication:sourceApplication annotation:annotation];
}

@end
