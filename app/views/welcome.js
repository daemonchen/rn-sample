'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  Image,
  Text,
  View
} = React;

var Login = require('../views/login');
var Register = require('../views/register');
var Button = require('../common/button.js');
var commonStyle = require('../styles/commonStyle');
var asyncStorage = require('../common/storage');

var authTokenAction = require('../actions/user/authTokenAction');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var _navigator, _topNavigator = null;
module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        return {}
    },
    goRegister: function(){
        _navigator.push({
            title: 'from home' + Math.random(),
            component: Register,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _navigator
        })
    },
    goLogin: function(){
        _navigator.push({
            title: 'from home' + Math.random(),
            component: Login,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _navigator
        })
    },
    render: function(){
        return (
            <View style={styles.welcome}>
                <Image style={styles.welcomeImage} source={require('../images/logo/logo_welcom.png')} />
                <View style={styles.welcomeWrapper}>
                    <Text style={[styles.welcomeText, commonStyle.textGray]} >
                    欢迎使用你造么
                    </Text>
                    <Text style={[styles.welcomeText, commonStyle.textGray]}>生产管理从未如此轻松</Text>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.goRegister} >
                        注册
                    </Button>
                    <Button
                    style={[commonStyle.button, commonStyle.blue]}
                    onPress={this.goLogin} >
                        登录
                    </Button>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    welcome: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center'
    },
    welcomeWrapper:{
        position:'absolute',
        bottom: 16,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeImage:{
        marginTop: 100
    },
    welcomeText: {
        paddingVertical: 12
    }
});