'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
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
var authTokenStore = require('./app/stores/user/authTokenStore');

var systemAction = require('./app/actions/system/systemAction');
var systemStore = require('./app/stores/system/systemStore');

var util = require('./app/common/util');

var awesomeMobile = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {}
    },
    componentWillMount: function(){
        this.getAppState();
    },
    componentDidMount: function(){
        this.unlisten = authTokenStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = authTokenStore.getState();
        if (result.type != 'updateToken') { return; };
        if (result.status != 200 && !!result.message) {
            this.getSystem();
            return;
        }
        appConstants.xAuthToken = result.data;
        asyncStorage.setItem('appConstants', appConstants);
        this.getSystem();
    },
    getSystem: function(){
        this.setTimeout(()=>{
            systemAction.init();
        }, 350);
    },
    getAppState: function(){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!data || !data.xAuthToken){
                this.getSystem();
            }else{
                appConstants.xAuthToken = data.xAuthToken;
                this.getNewXAuthToken();
            }
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
