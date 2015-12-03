'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var md5 = require('md5');
var {View,
    Text,
    TextInput,
    Navigator,
    StyleSheet
} = React;
var Button = require('../common/button.js');
var commonStyle = require('../styles/commonStyle');

var loginAction = require('../actions/user/loginAction');
var loginStore = require('../stores/user/loginStore');
var asyncStorage = require('../common/storage');

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
    componentDidMount: function(){
        this.unlisten = loginStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = loginStore.getState();
        if (result.type != 'login') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        asyncStorage.setItem('xAuthToken', {xAuthToken: result.data});
        _navigator.replace({
            title: 'Launch',
            component: Launch,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
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
        if (!this.state.mobile || !/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.state.mobile)) {
            util.alert('请输入手机号码');
            return;
        };
        if (!this.state.password) {
            util.alert('请输入密码');
            return;
        };
        loginAction.login({
            mobile: this.state.mobile,
            password: md5(this.state.password)
        });
    },
    onChangeMobileText: function(text){
        this.setState({
            mobile: text
        });
    },
    onChangePasswordText: function(text){
        this.setState({
            password: text
        });
    },
    onSubmitEditing: function(){
        this.doLogin();
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
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeMobileText}
                        keyboardType={'number-pad'} />
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='密码'
                        style={commonStyle.textInput}
                        secureTextEntry={true}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangePasswordText}
                        returnKeyType={'join'}
                        onSubmitEditing={this.onSubmitEditing} />
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