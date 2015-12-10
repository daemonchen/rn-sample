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
        this.unlistenLogout = loginStore.listen(this.onLogout);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenLogout();
    },
    onLogout: function(){
        var result = loginStore.getState();
        if (result.type != 'logout') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
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
        console.log('-----init result:', result);
        appConstants.systemInfo = result.data;
        asyncStorage.setItem('appConstants', appConstants);
        this.doLaunch();
    },
    doLaunch: function(){
        if (!appConstants.systemInfo.user) {
            _navigator.push({
                title: 'welcome' ,
                component: Welcome,
                sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
                topNavigator: _navigator
            })
        }else{
            _navigator.push({
                title: 'Launch' ,
                component: Launch,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                topNavigator: _navigator
            })
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
