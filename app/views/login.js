'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var TimerMixin = require('react-timer-mixin');
var md5 = require('md5');
var Actions = require('react-native-router-flux').Actions;
var {View,
    Text,
    TextInput,
    StyleSheet
} = React;
var Button = require('../common/button.js');
var commonStyle = require('../styles/commonStyle');

var loginAction = require('../actions/user/loginAction');

var LeftCloseButton = require('../common/leftCloseButton');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var NavTitleWithLogo = require('../common/navTitleWithLogo');
var Login = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {}
    },
    goResetPassword: function(){
        Actions.resetPassword();
    },
    doLogin: function(){
        if (!this.state.mobile || !/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.state.mobile)) {
            util.alert('请输入正确的手机号码');
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
                    leftButton={<LeftCloseButton />} />
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
                    style={[commonStyle.textLight, {fontSize: 12}]}
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