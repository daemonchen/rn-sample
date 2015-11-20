'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Navigator,
  StyleSheet,
  Text,
  View,
} = React;

var {
    Router,
    Route,
    Container,
    Actions,
    Schema
} = require('react-native-router-flux');

var {
    NavBar,
    NavBarModal
} = require('./app/common/navbar');

var TabBar = require('./app/common/tabBar');

var Launch = require('./app/views/launch');
var Register = require('./app/views/register');
var Login = require('./app/views/login');
var Error = require('./app/views/error');
var Home = require('./app/views/home/home');
var TabView = require('./app/views/tabViewSample');

var awesomeMobile = React.createClass({
  render: function() {
    return (
        <View style={styles.container}>
            <View style={styles.underView} />
            <Router>
                <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom} navBar={NavBarModal}/>
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight} navBar={NavBar}/>
                <Schema name="withoutAnimation" navBar={NavBar}/>
                <Schema name="tab" navBar={NavBar} sceneConfig={Navigator.SceneConfigs.HorizontalSwipeJump} />

                <Route name="launch" component={Launch} hideNavBar={true} title="Launch"/>
                <Route name="register" component={Register} title="Register"/>
                <Route name="login" component={Login} initial={true} title="login"/>
                <Route name="loginModal" component={Login} schema="modal" title="login"/>
                <Route name="error" component={Error} schema="popup"/>
                <Route name="tabbar" hideNavBar={true} type="replace">
                    <Container component={TabBar}>
                        <Route name="Workspace" component={Home} title="Workspace" icon={require('./app/images/TabBar/Workspace.png')} selectedIcon={require('./app/images/TabBar/Workspace_hover.png')} schema="tab"/>
                        <Route name="Order" component={TabView} title="Order" icon={require('./app/images/TabBar/Order.png')} selectedIcon={require('./app/images/TabBar/Order_hover.png')} schema="tab"/>
                        <Route name="Inbox" component={TabView} title="Inbox" icon={require('./app/images/TabBar/Inbox.png')} selectedIcon={require('./app/images/TabBar/Inbox_hover.png')} schema="tab"/>
                        <Route name="Contact" component={TabView} title="Contact" icon={require('./app/images/TabBar/Contact.png')} selectedIcon={require('./app/images/TabBar/Contact_hover.png')} schema="tab"/>
                        <Route name="Person" component={TabView} title="Person" icon={require('./app/images/TabBar/Person.png')} selectedIcon={require('./app/images/TabBar/Person_hover.png')} schema="tab"/>
                    </Container>
                </Route>
            </Router>

        </View>
    );
  }
});

var styles = StyleSheet.create({
    underView:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        bottom:0,
        backgroundColor:'#f1f1f1'
    },
    container: {
        flex: 1
    }
});

AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
