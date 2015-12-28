'use strict';

var React = require('react-native');
// var RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  Image,
  Text,
  PushNotificationIOS,
  NativeAppEventEmitter,
  View
} = React;

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

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var Launch = React.createClass({
    getInitialState: function () {
        return {
            selectedTab: 'Workspace',
            notifCount: appConstants.unreadMsg || 0,
            presses: 0,
        };
    },
    componentDidMount: function(){
        this.unlisten = inboxStore.listen(this.onChange);
        this.unlistenNotification =  NativeAppEventEmitter.addListener(
            'nzaomNotify',
            (notifData) => {
                this.factoryNotify(notifData);
            }
        );
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenNotification.remove();
    },
    factoryNotify: function(response){
        var jsonData = null;
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
        if (jsonData.type == 2) {
            authTokenAction.updateToken()
        };
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
        console.log('---inboxStore result', result);
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
            self.setState({
                selectedTab: tab
            });
        }
    },
    render: function() {
        return (
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
        );
    }
});
var styles = StyleSheet.create({

});
module.exports = Launch;