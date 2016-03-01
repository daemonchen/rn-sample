'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var {View,
    Text,
    TextInput,
    StyleSheet
} = React;
var Button = require('../../common/button.js');
var commonStyle = require('../../styles/commonStyle');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var ValidationCode = require('./validationCode');

var BlueBackButton = require('../../common/blueBackButton');

var verifyCodeAction = require('../../actions/user/verifyCodeAction');
var verifyCodeStore = require('../../stores/user/verifyCodeStore');

module.exports = React.createClass({
    getInitialState: function(){
        return {
            mobile: '',
            type: 2
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
        Actions.validationCode({
            title: 'ValidationCode',
            validateType: 2
        });
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
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'重置密码'}}
                    leftButton={<BlueBackButton />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='手机号码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        keyboardType={'number-pad'}
                        returnKeyType={'next'}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.getCode}/>
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