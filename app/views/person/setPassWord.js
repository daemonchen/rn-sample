'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {View,
    Text,
    Image,
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

var Launch = require('../launch');

var _navigator, _topNavigator = null;
var setPassWord = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    getCode: function(){
        _navigator.immediatelyResetRouteStack([{
            title: 'from home',
            component: Launch,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        }]);
        // _navigator.push({
        //     title: 'from home',
        //     component: Launch,
        //     sceneConfig: Navigator.SceneConfigs.FloatFromRight,
        //     topNavigator: _navigator
        // })
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
                    title={{title:'设置登录密码'}}
                    leftButton={this.leftButtonConfig} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='姓名'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}/>
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='设置密码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}/>
                    </View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.getCode} >
                        完成
                    </Button>
                    <Text style={commonStyle.textLight}>点击注册即表示您同意《你造么用户协议》</Text>
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



module.exports = setPassWord;