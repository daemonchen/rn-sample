'use strict';

var React = require('react-native');
var Actions = require('react-native-router-flux').Actions;
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Image,
  Text,
  View
} = React;

var Button = require('../common/button.js');
var commonStyle = require('../styles/commonStyle');


//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    getInitialState: function(){
        return {}
    },
    goRegister: function(){
        Actions.register();
    },
    goLogin: function(){
        Actions.login();
    },
    render: function(){
        return (
            <View style={styles.welcome}>
                <Image style={styles.welcomeImage} source={require('../images/logo/logo_welcom.png')} />
                <View style={styles.welcomeWrapper}>
                    <Text style={[styles.welcomeText, commonStyle.textGray]} >
                    欢迎使用你造么
                    </Text>
                    <Text style={[styles.welcomeText, commonStyle.textGray]}>生产管理从未如此轻松</Text>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.goRegister} >
                        注册
                    </Button>
                    <Button
                    style={[commonStyle.button, commonStyle.blue]}
                    onPress={this.goLogin} >
                        登录
                    </Button>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    welcome: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center'
    },
    welcomeWrapper:{
        position:'absolute',
        bottom: 16,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeImage:{
        marginTop: 100
    },
    welcomeText: {
        paddingVertical: 12
    }
});