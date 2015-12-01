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

var userAction = require('../actions/user/userAction');
var userStore = require('../stores/user/userStore');

var ValidationCode = require('../views/person/validationCode');
var NavTitleWithLogo = require('../common/navTitleWithLogo');
var _navigator = null;
var register = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        return {
            mobile: '13750892695',
            type: 1
        }
    },
    componentDidMount: function() {
        userStore.listen(this.onGetVarifyCode);
    },

    onGetVarifyCode: function() {
        _navigator.push({
            title: 'ValidationCode',
            component: ValidationCode,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
    },
    getCode: function(){
        userAction.getVerifyCode({
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
                    leftButton={{ title: 'X', }} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='手机号码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeText}
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