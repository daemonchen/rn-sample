'use strict';

var React = require('react-native');

var {StyleSheet, TabBarIOS} = React;

var AppNavigator = require('../common/navbar');
var Home = require('../views/home/home');
var Order = require('../views/order/order');
var Inbox = require('../views/inbox/inboxList');
var Contact = require('../views/contact/contact');
var UserIndex = require('../views/person/userIndex');
var tabViewSample = require('../views/tabViewSample');
var calendar = require('../views/calendar');
var datePicker = require('../views/datePicker');
//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var Launch = React.createClass({
    getInitialState: function () {
        return {
            selectedTab: 'Workspace',
            notifCount: 0,
            presses: 0,
        };
    },

    _handlePress: function (tab) {
        var self = this;
        return function () {
            self.setState({
                selectedTab: tab,
                notifCount: self.state.notifCount + 1,
            });
        }
    },
    render: function() {
        return (
            <TabBarIOS
                style={styles.tabbarView}
                tintColor = "#4285f4"
                barTintColor = "#fff"
                translucent = {true} >
                <TabBarIOS.Item
                    title="Workspace"
                    badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                    icon={require('../images/TabBar/Workspace.png')}
                    selectedIcon={require('../images/TabBar/Workspace_selected.png')}
                    selected={this.state.selectedTab === 'Workspace'}
                    onPress={this._handlePress("Workspace")}>
                    <AppNavigator initialRoute={{title: 'Workspace', component:Home, topNavigator: this.props.navigator}} key='Workspace' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Order"
                    icon={require('../images/TabBar/Order.png')}
                    selectedIcon={require('../images/TabBar/Order_selected.png')}
                    selected={this.state.selectedTab === 'Order'}
                    onPress={this._handlePress("Order")}>
                    <AppNavigator initialRoute={{title: 'Order', component:Order, topNavigator: this.props.navigator}} key='Order' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Inbox"
                    icon={require('../images/TabBar/Inbox.png')}
                    selectedIcon={require('../images/TabBar/Inbox_selected.png')}
                    selected={this.state.selectedTab === 'Inbox'}
                    onPress={this._handlePress("Inbox")}>
                    <AppNavigator initialRoute={{title: 'Inbox', component:Inbox, topNavigator: this.props.navigator}} key='Inbox' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Contact"
                    icon={require('../images/TabBar/Contacts.png')}
                    selectedIcon={require('../images/TabBar/Contacts_selected.png')}
                    selected={this.state.selectedTab === 'Contact'}
                    onPress={this._handlePress("Contact")}>
                    <AppNavigator initialRoute={{title: '通讯录', target: 2, component:Contact, topNavigator: this.props.navigator}} key='Contact' />
                </TabBarIOS.Item>
                <TabBarIOS.Item
                    title="Person"
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
    tabbarView: {

    }
});
module.exports = Launch;