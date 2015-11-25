'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {View,
    Text,
    TextInput,
    Navigator,
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

var _navigator, _topNavigator = null;
var getValidCode = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    getCode: function(){
        _navigator.replace({
            title: 'from home',
            component: ValidationCode,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
    },
    leftButtonConfig: {
        title: '<',
        handler:() =>
            _navigator.pop()
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'重置密码'}}
                    leftButton={this.leftButtonConfig} />
                <View style={styles.main}>
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



module.exports = getValidCode;