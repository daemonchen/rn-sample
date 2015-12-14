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
var LeftCloseButton = require('../common/leftCloseButton');
var commonStyle = require('../styles/commonStyle');

var verifyCodeAction = require('../actions/user/verifyCodeAction');
var verifyCodeStore = require('../stores/user/verifyCodeStore');

var ValidationCode = require('./person/validationCode');
var NavTitleWithLogo = require('../common/navTitleWithLogo');
var util = require('../common/util');
var _navigator = null;
var register = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
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
            util.alert(result.message);
            return;
        }
        _navigator.push({
            title: 'ValidationCode',
            type: 1,
            component: ValidationCode,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
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
                    title={<NavTitleWithLogo />}
                    leftButton={<LeftCloseButton navigator={_navigator} />} />
                <View style={styles.main}>
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