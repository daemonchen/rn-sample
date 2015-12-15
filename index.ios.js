'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var Orientation = require('react-native-orientation');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  Image,
  Text,
  View,
} = React;

var AppNavigator = require('./app/common/navbar');
var Advertisement = require('./app/views/advertisement');

var appConstants = require('./app/constants/appConstants');
var asyncStorage = require('./app/common/storage');

var authTokenAction = require('./app/actions/user/authTokenAction');

var util = require('./app/common/util');

var awesomeMobile = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {}
    },
    componentWillMount: function(){
        Orientation.lockToPortrait();
        this.getAppState();
        this.getLocation();
    },
    getLocation: function(){
        var location = {};
        navigator.geolocation.getCurrentPosition(
            (position) => {
                appConstants.location = position;
                asyncStorage.setItem('appConstants', appConstants);
            },
            (error) => console.log(error.message),
            {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000}
        );
    },
    getAppState: function(){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data && !!data.xAuthToken){
                appConstants.xAuthToken = data.xAuthToken;
            }
            this.getNewXAuthToken();
        }).done();
    },
    getNewXAuthToken: function(){
        this.setTimeout(()=>{
            authTokenAction.updateToken();
        }, 350);
    },
    render: function(){
        return(
            <AppNavigator initialRoute={{title: 'advertisement', component:Advertisement}} />
            );
    }
});



AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
