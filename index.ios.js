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
var Launch = require('./app/views/launch');

var awesomeMobile = React.createClass({
    render: function(){
        return (
            <AppNavigator initialRoute={{title: 'Launch', component:Launch}} key='Launch' />
            )

    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
