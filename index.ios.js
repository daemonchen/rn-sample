'use strict';

var React = require('react-native');
var {
  AppRegistry,
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
} = require('./components/NavBar');

var Launch = require('./app/views/launch');
var Register = require('./app/views/register');
var Login = require('./app/views/login');
var Error = require('./app/views/error');
var Home = require('./app/views/home/home');
var TabView = require('./components/TabView');
var TabIcon = require('./components/TabIcon');
var TabBarFlux = require('./components/TabBarFlux');

var awesomeMobile = React.createClass({
  render: function() {
    return (
        <View style={styles.container}>
            <View style={{position:'absolute',left:0,right:0,top:0,bottom:0,backgroundColor:'#F5FCFF'}}/>
            <Router>
                <Schema name="modal" sceneConfig={Animations.FlatFloatFromBottom} navBar={NavBarModal}/>
                <Schema name="default" sceneConfig={Animations.FlatFloatFromRight} navBar={NavBar}/>
                <Schema name="withoutAnimation" navBar={NavBar}/>
                <Schema name="tab" navBar={NavBar}/>

                <Route name="launch" component={Launch} initial={true} hideNavBar={true} title="Launch"/>
                <Route name="register" component={Register} title="Register"/>
                <Route name="home" component={Home} title="Home" type="replace"/>
                <Route name="login" component={Login} schema="modal"/>
                <Route name="register2" component={Register} schema="withoutAnimation"/>
                <Route name="error" component={Error} schema="popup"/>
                <Route name="tabbar" hideNavBar={true} >
                    <Container component={TabBarFlux}>
                        <Route name="tab1" component={TabView} title="Tab #1" icon={TabIcon} schema="tab"/>
                        <Route name="tab2" component={TabView} title="Tab #2" icon={TabIcon} schema="tab"/>
                        <Route name="tab3" component={TabView} title="Tab #3" icon={TabIcon} schema="tab"/>
                        <Route name="tab4" component={TabView} title="Tab #4" icon={TabIcon} schema="tab"/>
                        <Route name="tab5" component={TabView} title="Tab #5" icon={TabIcon} schema="tab"/>
                    </Container>
                </Route>
            </Router>

        </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
