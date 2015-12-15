'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  ActivityIndicatorIOS,
  Image,
  Text,
  View,
} = React;

var appConstants = require('../constants/appConstants');

var commonStyle = require('../styles/commonStyle');
var asyncStorage = require('../common/storage');

var systemAction = require('../actions/system/systemAction');
var systemStore = require('../stores/system/systemStore');
var loginStore = require('../stores/user/loginStore');
var verifyCodeStore = require('../stores/user/verifyCodeStore');
var authTokenStore = require('../stores/user/authTokenStore');


var Welcome = require('./welcome');
var Launch = require('./launch');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var _navigator, _topNavigator = null;
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        return {}
    },
    componentDidMount: function(){
        this.unlisten = systemStore.listen(this.onChange);
        this.unlistenLogin = loginStore.listen(this.onLoginChange);
        this.unlistenVerifyCode = verifyCodeStore.listen(this.onVerifyCodeChange)
        this.unAuthlisten = authTokenStore.listen(this.onAuthChange);
        // if (!!this._timeout) {
        //     this.clearTimeout(this._timeout);
        // };
        // this.setTimeout(()=>{
        //     this.doLaunch();
        // }, 1050);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenLogin();
        this.unlistenVerifyCode();
        this.unAuthlisten();
    },
    onAuthChange: function(){
        var result = authTokenStore.getState();
        if (result.status != 200 && !!result.message) {
            this.goWelcome();
            return;
        }
        switch(result.type){
            case 'updateToken':
                return this.doLogin(result);
            default: return;
        }
    },
    onVerifyCodeChange: function(){
        var result = verifyCodeStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'register':
                return this.doLogin(result);
            default: return;
        }
    },
    onLoginChange: function(){
        var result = loginStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'login':
                return this.doLogin(result);
            case 'logout':
                return this.doLogout(result);
            default: return;
        }
    },
    doLogin: function(result){
        appConstants.xAuthToken = result.data.token;
        appConstants.user = result.data.user;
        appConstants.userRights = result.data.userRights;
        console.log('---userRights:', appConstants.userRights);
        this.getAppState();
        asyncStorage.setItem('appConstants', appConstants);
    },
    getAppState: function(){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            systemAction.init();
        }, 350);
    },
    doLogout: function(){
        appConstants = {};
        asyncStorage.setItem('appConstants', appConstants);
        _navigator.immediatelyResetRouteStack([{
            title: 'welcome' ,
            component: Welcome,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _navigator
        }])
    },
    onChange: function(){
        var result = systemStore.getState();
        if (result.type != 'init') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        appConstants.unreadMsg = result.data.unreadMsg;
        asyncStorage.setItem('appConstants', appConstants)
        .then(()=>{
            this.doLaunch();
        });;

    },
    goWelcome: function(){
        _navigator.push({
            title: 'welcome',
            component: Welcome,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
    },
    goMain: function(){
        _navigator.push({
            title: 'Launch',
            component: Launch,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
    },
    doLaunch: function(){
        if (!appConstants.user) {
            this.goWelcome();
        }else{
            this.goMain();
        }
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <Image
                  style={{width: width, height: height}}
                  source={require('../images/default.png')} />

            </View>
        );
    }
});
