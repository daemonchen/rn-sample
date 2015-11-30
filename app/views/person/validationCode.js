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

var SetPassword = require('./setPassWord');

var _navigator, _topNavigator = null;
var validationCode = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    getCode: function(){
        _navigator.push({
            title: 'xx',
            component: SetPassword,
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
                    title={{title:'验证'}}
                    leftButton={this.leftButtonConfig} />
                <View style={styles.main}>
                    <View style={styles.phoneWrapper}>
                        <Image source={require('../../images/Send.png')}/>
                        <Text>15867349810</Text>
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='请输入验证码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}/>
                        <Text
                        style={styles.textInputTimer}>
                        剩余40秒
                        </Text>
                    </View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.getCode} >
                        下一步
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
    },
    phoneWrapper: {
        width: width,
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    textInputTimer:{
        width: 114,
        backgroundColor: '#fff',
        position: 'absolute',
        right: 0,
        top: 12
    }
});



module.exports = validationCode;