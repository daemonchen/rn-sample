'use strict';

var React = require('react-native');
import NavigationBar from '../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var {View,
    Text,
    TextInput,
    StyleSheet
} = React;
var Button = require('../common/button.js');
var LeftCloseButton = require('../common/leftCloseButton');
var commonStyle = require('../styles/commonStyle');

var verifyCodeAction = require('../actions/user/verifyCodeAction');
var verifyCodeStore = require('../stores/user/verifyCodeStore');

var ValidationCode = require('./person/validationCode');
var NavTitleWithLogo = require('../common/navTitleWithLogo');
var util = require('../common/util');
var register = React.createClass({
    getInitialState: function(){
        return {
            mobile: '',
            type: 1
        }
    },
    componentDidMount: function(){
        this.unlisten = verifyCodeStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = verifyCodeStore.getState();
        if (result.type != 'get') { return; };
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
        Actions.validationCode({validateType: 1});
    },
    getCode: function(){
        if (!this.state.mobile || !/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(this.state.mobile)) {
            util.alert('请输入手机号码');
            return;
        };
        verifyCodeAction.getVerifyCode({
            mobile: this.state.mobile,
            type: this.state.type
        });
    },
    onChangeText: function(text){
        this.setState({
            mobile: text
        });
    },
    onSubmitEditing: function(){
        this.getCode();
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={<NavTitleWithLogo />}
                    leftButton={<LeftCloseButton />} />
                <View style={[styles.main, {marginTop: 20}]}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='手机号码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeText}
                        keyboardType={'number-pad'}
                        returnKeyType={'next'}
                        onSubmitEditing={this.onSubmitEditing}
                        value={this.state.mobile} />
                    </View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.getCode} >
                        获取验证码
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



module.exports = register;