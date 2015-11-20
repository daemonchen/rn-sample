'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Text,
  View,
} = React;

var AppNavigator = require('./app/common/navbar');
var Home = require('./app/views/home/home');
var tabViewSample = require('./app/views/tabViewSample');

var awesomeMobile = React.createClass({
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
            tintColor = "#333"
            barTintColor = "#fff">
            <TabBarIOS.Item
                title="Workspace"
                badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
                icon={require('./app/images/TabBar/Workspace.png')}
                selectedIcon={require('./app/images/TabBar/Workspace_hover.png')}
                selected={this.state.selectedTab === 'Workspace'}
                onPress={this._handlePress("Workspace")}>
                <AppNavigator initialRoute={{title: 'Workspace', component:Home}} key='Workspace' />
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Order"
                icon={require('./app/images/TabBar/Order.png')}
                selectedIcon={require('./app/images/TabBar/Order_hover.png')}
                selected={this.state.selectedTab === 'Order'}
                onPress={this._handlePress("Order")}>
                <AppNavigator initialRoute={{title: 'Order', component:tabViewSample}} key='Order' />
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Inbox"
                icon={require('./app/images/TabBar/Inbox.png')}
                selectedIcon={require('./app/images/TabBar/Inbox_hover.png')}
                selected={this.state.selectedTab === 'Inbox'}
                onPress={this._handlePress("Inbox")}>
                <AppNavigator initialRoute={{title: 'Inbox', component:tabViewSample}} key='Inbox' />
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Contact"
                icon={require('./app/images/TabBar/Contact.png')}
                selectedIcon={require('./app/images/TabBar/Contact_hover.png')}
                selected={this.state.selectedTab === 'Contact'}
                onPress={this._handlePress("Contact")}>
                <AppNavigator initialRoute={{title: 'Contact', component:tabViewSample}} key='Contact' />
            </TabBarIOS.Item>
            <TabBarIOS.Item
                title="Person"
                icon={require('./app/images/TabBar/Person.png')}
                selectedIcon={require('./app/images/TabBar/Person_hover.png')}
                selected={this.state.selectedTab === 'Person'}
                onPress={this._handlePress("Person")}>
                <AppNavigator initialRoute={{title: 'Person', component:tabViewSample}} key='Person' />
            </TabBarIOS.Item>
        </TabBarIOS>
    );
  }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
