'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var TimerMixin = require('react-timer-mixin');
var md5 = require('md5');
var Actions = require('react-native-router-flux').Actions;
var {View,
    Text,
    Image,
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
        return {
            isFocusPhone: false,
            isFocusPassword: false
        }
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
    onFocusPhone: function(){
        this.setState({
            isFocusPhone: true
        });
    },
    onBlurPhone: function(){
        this.setState({
            isFocusPhone: false
        });
    },
    onFocusPassword: function(){
        this.setState({
            isFocusPassword: true
        });
    },
    onBlurPassword: function(){
        this.setState({
            isFocusPassword: false
        });
    },
    renderPhoneTextInput: function(){
        var icon = !!this.state.isFocusPhone ? require('../images/login/phone_number_selected.png') : require('../images/login/phone_number.png');
        var borderStyle = !!this.state.isFocusPhone ? commonStyle.textInputWrapperBlueBorder : null;
        return(
            <View style={[commonStyle.textInputWrapper, borderStyle]}>
                <Image style={commonStyle.textInputIcon}
                source={icon} />
                <TextInput placeholder='手机号码'
                style={commonStyle.textInput}
                clearButtonMode={'while-editing'}
                onChangeText={this.onChangeMobileText}
                onFocus={this.onFocusPhone}
                onBlur={this.onBlurPhone}
                keyboardType={'number-pad'} />
            </View>
            );
    },
    renderPasswordTextInput: function(){
        var icon = !!this.state.isFocusPassword ? require('../images/login/encryption_selected.png') : require('../images/login/encryption.png');
        var borderStyle = !!this.state.isFocusPassword ? commonStyle.textInputWrapperBlueBorder : null;
        return(
            <View style={[commonStyle.textInputWrapper, borderStyle]}>
                <Image style={commonStyle.textInputIcon}
                source={icon} />
                <TextInput placeholder='密码'
                style={commonStyle.textInput}
                secureTextEntry={true}
                clearButtonMode={'while-editing'}
                onChangeText={this.onChangePasswordText}
                onFocus={this.onFocusPassword}
                onBlur={this.onBlurPassword}
                returnKeyType={'join'}
                onSubmitEditing={this.onSubmitEditing} />
            </View>
            );
    },
    renderLoginBtn: function(){
        if (!!this.state.mobile && !!this.state.password) {
            return(
                <Button
                    style={[commonStyle.button, commonStyle.blue, {fontSize: 24, marginTop: 10, marginBottom: 28}]}
                    onPress={this.doLogin} >
                        登录
                    </Button>

                );
        };
        return(
            <Button
                    style={[commonStyle.button, commonStyle.textLight, {fontSize: 24, marginTop: 10, marginBottom: 28}]}
                    onPress={this.doLogin} >
                        登录
                    </Button>
                );
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={<NavTitleWithLogo />}
                    leftButton={<LeftCloseButton />} />
                <View style={[styles.main, {paddingTop: 20}]}>
                    {this.renderPhoneTextInput()}
                    {this.renderPasswordTextInput()}
                    {this.renderLoginBtn()}

                    <Button
                    style={[commonStyle.textLight, {fontSize: 14}]}
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