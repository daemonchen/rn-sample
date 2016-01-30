'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var Orientation = require('react-native-orientation');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  AlertIOS,
  PushNotificationIOS,
  Image,
  Text,
  View,
} = React;

// var AppNavigator = require('./app/common/navbar');
// var Advertisement = require('./app/views/advertisement');
var Router = require('./app/views/router');

var appConstants = require('./app/constants/appConstants');
var asyncStorage = require('./app/common/storage');

var authTokenAction = require('./app/actions/user/authTokenAction');
var appAction = require('./app/actions/app/appAction');

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
        PushNotificationIOS.addEventListener('notification', this._onNotification);
    },
    componentWillUnmount: function() {
        PushNotificationIOS.removeEventListener('notification', this._onNotification);
    },
    _onNotification: function(notification) {
      //TODO: 处理apns推送消息
        // AlertIOS.alert(
        //   'Notification Received',
        //   'Alert message: ' + notification.getMessage(),
        //   [{
        //     text: 'Dismiss',
        //     onPress: null,
        //   }]
        // );
    },
    getLocation: function(){
        var location = {};
        navigator.geolocation.getCurrentPosition(
            (position) => {
                appConstants.location = position;
                console.log('-----getLocation');
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
                this.setTimeout(function(){
                    appAction.init(appConstants);
                }, 350)
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
            <Router />
            );
    }
});



AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
