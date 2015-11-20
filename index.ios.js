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
    Animations,
    Schema
} = require('react-native-router-flux');

var {
    NavBar,
    NavBarModal
} = require('./app/common/navbar');

var Launch = require('./app/views/launch');
var Register = require('./app/views/register');
var Login = require('./app/views/login');
var Error = require('./app/views/error');
var Home = require('./app/views/home/home');
var TabView = require('./app/views/tabViewSample');
var TabIcon = require('./app/views/tabIconSample');
var TabBarFlux = require('./app/views/tabBarFluxSample');

var awesomeMobile = React.createClass({
  render: function() {
    return (
        <View style={styles.container}>
            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#f1f1f1'}}/>
            <Router>
                <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom} navBar={NavBarModal}/>
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight} navBar={NavBar}/>
                <Schema name="withoutAnimation" navBar={NavBar}/>
                <Schema name="tab" navBar={NavBar} sceneConfig={Navigator.SceneConfigs.HorizontalSwipeJump} />

                <Route name="launch" component={Launch} initial={true} hideNavBar={true} title="Launch"/>
                <Route name="register" component={Register} title="Register"/>
                <Route name="home" component={Home} title="Home" type="replace"/>
                <Route name="login" component={Login} schema="modal"/>
                <Route name="register2" component={Register} schema="withoutAnimation"/>
                <Route name="error" component={Error} schema="popup"/>
                <Route name="tabbar" hideNavBar={true} type="replace">
                    <Container component={TabBarFlux}>
                        <Route name="tab1" component={TabView} title="首页" icon={require('./app/images/TabBar/ico_home_black.png')} selectedIcon={require('./app/images/TabBar/ico_home_black_hover.png')} schema="tab"/>
                        <Route name="tab2" component={TabView} title="首页2" icon={require('./app/images/TabBar/ico_home_black.png')} selectedIcon={require('./app/images/TabBar/ico_home_black_hover.png')} schema="tab"/>
                        <Route name="tab3" component={TabView} title="首页3" icon={require('./app/images/TabBar/ico_home_black.png')} selectedIcon={require('./app/images/TabBar/ico_home_black_hover.png')} schema="tab"/>
                    </Container>
                </Route>
            </Router>

        </View>
    );
  }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
