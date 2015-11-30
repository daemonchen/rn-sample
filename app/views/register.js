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

var ValidationCode = require('../views/person/validationCode');
var NavTitleWithLogo = require('../common/navTitleWithLogo');
var _navigator = null;
var register = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        return {}
    },
    getCode: function(){
        _navigator.push({
            title: 'from home' + Math.random(),
            component: ValidationCode,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
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
                        <TextInput placeholder='姓名'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}/>
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='手机号码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}/>
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