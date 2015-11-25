'use strict';

var React = require('react-native');
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
var Launch = require('./app/views/launch');
var Login = require('./app/views/login');
var Register = require('./app/views/register');
var Button = require('./app/common/button.js');
var commonStyle = require('./app/styles/commonStyle');
//获取可视窗口的宽高
var util = require('./app/common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var _navigator, _topNavigator = null;
var Welcome = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        // _topNavigator = this.props.route.topNavigator;
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
    goLaunch: function(){
        _navigator.replace({
            title: 'home' ,
            component: Launch,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _navigator
        })
    },
    render: function(){
        return (
            <View style={styles.welcome}>
                <Image style={styles.welcomeImage} source={require('./app/images/logo.png')} />
                <View style={styles.welcomeWrapper}>
                    <Text style={[styles.welcomeText, commonStyle.textGray]}
                    onPress={this.goLaunch}>
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
})

var awesomeMobile = React.createClass({
    getInitialState: function(){
        return {
            login: false
        }
    },
    render: function(){
        if (!this.state.login) {
            return (
                <AppNavigator initialRoute={{title: 'welcome', component:Welcome}} key='welcome' />
                )
        };
        return (
                <AppNavigator initialRoute={{title: 'Launch', component:Launch, sceneConfig: Navigator.SceneConfigs.FloatFromLeft}} key='Launch' />
                )
    }
});

var styles = StyleSheet.create({
    welcome: {
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

AppRegistry.registerComponent('awesomeMobile', () => awesomeMobile);
