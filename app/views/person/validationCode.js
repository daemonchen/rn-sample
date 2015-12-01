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

var verifyCodeAction = require('../../actions/user/verifyCodeAction');
var verifyCodeStore = require('../../stores/user/verifyCodeStore');

var asyncStorage = require('../../common/storage');
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
        console.log('verifyData', asyncStorage.getItem('verifyData'));
        return {
            mobile: asyncStorage.getItem('verifyData').mobile,
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
        if (result.type != 'check') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        console.log('onChange verifycode', result);
        _navigator.push({
            title: 'ValidationCode',
            component: SetPassword,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
    },
    doVerify: function(){
        var data = verifyCodeStore.getState();
        verifyCodeAction.verifyCode({
            code: this.state.code,
            mobile: asyncStorage.getItem('verifyData').mobile,
            type: this.state.type
        });
    },
    leftButtonConfig:function() {
        return{
            title: '<',
            handler:() =>
                _navigator.pop()
        }
    },

    onSubmitEditing: function(){
        this.doVerify();
    },
    onChangeText: function(text){
        this.setState({
            code: text
        });
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'验证'}}
                    leftButton={this.leftButtonConfig()} />
                <View style={styles.main}>
                    <View style={styles.phoneWrapper}>
                        <Image source={require('../../images/Send.png')}/>
                        <Text>{this.state.mobile}</Text>
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='请输入验证码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeText}
                        onSubmitEditing={this.onSubmitEditing} />
                        <Text
                        style={styles.textInputTimer}>
                        剩余40秒
                        </Text>
                    </View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.doVerify} >
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