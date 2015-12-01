'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {View,
    Text,
    TextInput,
    Navigator,
    StyleSheet
} = React;
var Button = require('../common/button.js');
var commonStyle = require('../styles/commonStyle');

var http = require('../common/http');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var Launch = require('../views/launch');
var ResetPassword = require('../views/person/resetPassword');
var NavTitleWithLogo = require('../common/navTitleWithLogo');
var _navigator = null;
var Login = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        return {}
    },
    goResetPassword: function(){
        _navigator.push({
            title: 'from home' + Math.random(),
            component: ResetPassword,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
    },
    doLogin: function(){
        _navigator.replace({
            title: 'from home' + Math.random(),
            component: Launch,
            // sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _navigator
        })
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={<NavTitleWithLogo />}
                    leftButton={{ title: 'X', }} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='手机号码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}/>
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='密码'
                        style={commonStyle.textInput}
                        secureTextEntry={true}
                        clearButtonMode={'while-editing'}/>
                    </View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.doLogin} >
                        登录
                    </Button>
                    <Button
                    style={commonStyle.textLight}
                    onPress={this.goResetPassword} >
                        忘记您的密码?
                    </Button>
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});



module.exports = Login;