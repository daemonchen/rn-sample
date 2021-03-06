'use strict';

import React, {
    AppRegistry,
    StyleSheet,
    TabBarIOS,
    Navigator,
    Image,
    Text,
    PushNotificationIOS,
    // NativeAppEventEmitter,
    Linking,
    View,
    Animated
} from 'react-native'
var NativeAppEventEmitter = require('RCTNativeAppEventEmitter');
// var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var DeviceInfo = require('react-native-device-info');
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');


var AppNavigator = require('../common/navbar');
var Home = require('../views/home/home');
var Order = require('../views/order/order');
var Inbox = require('../views/inbox/inboxList');
var Contact = require('../views/contact/contact');
var UserIndex = require('../views/person/userIndex');

var appConstants = require('../constants/appConstants');

var asyncStorage = require('../common/storage');

var inboxStore = require('../stores/inbox/inboxStore');
var authTokenAction = require('../actions/user/authTokenAction');
var notificationAction = require('../actions/notification/notificationAction');
var loginAction = require('../actions/user/loginAction');
var schemeAction = require('../actions/scheme/schemeAction');
var schemeStore = require('../stores/scheme/schemeStore');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function () {
        return {
            selectedTab: 'Workspace',
            notifCount: appConstants.unreadMsg || 0,
            presses: 0,
            viewBounceValue: new Animated.Value(0)
        };
    },
    componentDidMount: function(){
        this.unlisten = inboxStore.listen(this.onChange);
        this.unlistenScheme = schemeStore.listen(this.onSchemeChange);

        this.addNativeAppEventListener();//监听推送消息

        this.getAppConstants();//初始化消息未读数

        Linking.addEventListener('url', this._handleOpenURL);

        var url = Linking.getInitialURL();
        this.factoryLinkingScheme(url);

        // this.doLaunchWithAnimate();//带有动画的打开页面
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenScheme();
        this.removeNativeAppEventListener();//移除推送消息的监听
        Linking.removeEventListener('url', this._handleOpenURL);
    },
    addNativeAppEventListener: function(){
        try{
            this.unlistenNotification =  NativeAppEventEmitter.addListener(
                'nzaomNotify',
                (notifData) => {
                    this.factoryNotify(notifData);
                }
            );
        }catch(e){
            console.log('[nzaom error:]', e);
        }
    },
    removeNativeAppEventListener: function(){
        !!this.unlistenNotification && this.unlistenNotification.remove();
    },
    getAppConstants: function(){
        var self = this;
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data && !!data.xAuthToken){
                appConstants = data;
                if (this._timeout) {
                    this.clearTimeout(this._timeout);
                };
                this._timeout = this.setTimeout(function(){
                    self.setState({
                        notifCount: !!appConstants.unreadMsg ? appConstants.unreadMsg : 0
                    });
                }, 350)
            }
        }).done();
    },
    doLaunchWithAnimate: function(){
        Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
          this.state.viewBounceValue,                 // 将`circleBounceValue`值动画化
          {
            toValue: 1,                         // 将其值以动画的形式改到一个较小值
            friction: 7,                          // Bouncier spring
          }
        ).start();
    },
    onSchemeChange: function(){
        var result = schemeStore.getState();
        // console.log('---scheme change', result.scheme, /nzaom:\/\/setting/.test(result.scheme));
        if (!result.scheme) { return;};
        var params = util.getParams(result.scheme.split('?')[1]);
        if (/nzaom:\/\/workbench/.test(result.scheme)) {
            this._handlePress('Workspace')();
        };
        if (/nzaom:\/\/order/.test(result.scheme)) {
            this._handlePress('Order')();
        };
        if (/nzaom:\/\/message/.test(result.scheme)) {
            this._handlePress('Inbox')();
        };
        if (/nzaom:\/\/setting/.test(result.scheme)) {
            this._handlePress('Person')();
        };
        if (/nzaom:\/\/order_detail/.test(result.scheme)) {
            Actions.orderDetail({
                data: params.orderId
            });
        };
        if (/nzaom:\/\/task_detail/.test(result.scheme)) {
            Actions.taskDetail({
                data: params.taskId
            });
        };
    },
    factoryLinkingScheme: function(scheme){
        if (typeof(scheme) != 'string') {return;};
        // console.log('-----factoryLinkingScheme', scheme);
        schemeAction.change({
            "scheme": scheme
        });
    },
    _handleOpenURL: function(event){
        this.factoryLinkingScheme(event.url);
    },
    factoryNotify: function(response){//处理个推透传消息
        var jsonData = null;
        console.log('----factoryNotify', response);
        try{
            jsonData = JSON.parse(response);
        }catch(err){
            console.log(err);
        }
        if (!jsonData) { return; };
        if (jsonData.type == 1) {
            this.setBadge(jsonData.data.unreadMsgCount);
            notificationAction.notify(jsonData);
        };
        if (jsonData.type == 2) {//权限更新
            authTokenAction.updateToken()
        };
        if (jsonData.type == 3) {
            //TODO: devicetoken DeviceInfo.getUniqueID()
            if (DeviceInfo.getUniqueID() == jsonData.imei) {
                this.doLogout()
            };
        };
    },
    doLogout: function(){
        util.alert('系统检测到您的帐号在其他设备上登录');
        loginAction.logout();

    },
    setBadge: function(count){
        appConstants.unreadMsg = count;
        this.setState({
            notifCount: appConstants.unreadMsg
        });
        PushNotificationIOS.setApplicationIconBadgeNumber(appConstants.unreadMsg);
    },
    handleUpdate: function(result){
        if (result.readStatus == 1) {
            appConstants.unreadMsg = appConstants.unreadMsg + 1;
        }else{
            appConstants.unreadMsg = appConstants.unreadMsg - 1;
        }
        this.setState({
            notifCount: appConstants.unreadMsg
        });
    },
    handleDelete: function(result){
        appConstants.unreadMsg = appConstants.unreadMsg - 1;
        this.setState({
            notifCount: appConstants.unreadMsg
        });
    },
    onChange: function() {
        var result = inboxStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'update':
                return this.handleUpdate(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    _handlePress: function (tab) {
        var self = this;
        return function () {
            // console.log('----_handlePress', tab);
            util.logEvent('tabSwitch', {tabName: tab});
            self.setState({
                selectedTab: tab
            });
        }
    },
    render: function() {
        return (
            <View style={{
                flex: 1
            }}>
            <TabBarIOS
                tintColor = "#4285f4"
                translucent = {true} >
                <TabBarIOS.Item
                    title="工作台"
                    icon={require('../images/TabBar/workspace_gray.png')}
                    selectedIcon={require('../images/TabBar/workspace_selected.png')}
                    selected={this.state.selectedTab === 'Workspace'}
                    onPress={this._handlePress("Workspace")}>
                    <AppNavigator initialRoute={{title: 'Workspace', component:Home, topNavigator: this.props.navigator}} key='Workspace' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="订单"
                    icon={require('../images/TabBar/order_gray.png')}
                    selectedIcon={require('../images/TabBar/order_selected.png')}
                    selected={this.state.selectedTab === 'Order'}
                    onPress={this._handlePress("Order")}>
                    <AppNavigator initialRoute={{title: 'Order', component:Order, topNavigator: this.props.navigator}} key='Order' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="消息"
                    badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                    icon={require('../images/TabBar/Inbox.png')}
                    selectedIcon={require('../images/TabBar/Inbox_selected.png')}
                    selected={this.state.selectedTab === 'Inbox'}
                    onPress={this._handlePress("Inbox")}>
                    <AppNavigator initialRoute={{title: 'Inbox', component:Inbox, topNavigator: this.props.navigator}} key='Inbox' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="通讯录"
                    icon={require('../images/TabBar/Contacts.png')}
                    selectedIcon={require('../images/TabBar/Contacts_selected.png')}
                    selected={this.state.selectedTab === 'Contact'}
                    onPress={this._handlePress("Contact")}>
                    <AppNavigator initialRoute={{title: '通讯录', target: 3, component:Contact, topNavigator: this.props.navigator}} key='Contact' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="我"
                    icon={require('../images/TabBar/Person.png')}
                    selectedIcon={require('../images/TabBar/Person_selected.png')}
                    selected={this.state.selectedTab === 'Person'}
                    onPress={this._handlePress("Person")}>
                    <AppNavigator initialRoute={{title: 'Person', component:UserIndex, topNavigator: this.props.navigator}} key='Person' />
                </TabBarIOS.Item>
            </TabBarIOS>
            </View>
        );
    }
});
