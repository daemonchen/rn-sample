'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var md5 = require('md5');
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    Image,
    TextInput,
    Navigator,
    StyleSheet
} = React;
var Button = require('../../common/button.js');
var commonStyle = require('../../styles/commonStyle');

var BlueBackButton = require('../../common/blueBackButton');

var verifyCodeAction = require('../../actions/user/verifyCodeAction');
var verifyCodeStore = require('../../stores/user/verifyCodeStore');
var systemAction = require('../../actions/system/systemAction');
var systemStore = require('../../stores/system/systemStore');

var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var Launch = require('../launch');

var _navigator, _topNavigator = null;
var setPassWord = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            verifyCode: '',
            mobile: '',
            username: '',
            password: ''
        }
    },
    componentDidMount: function(){
        asyncStorage.getItem('verifyData')
        .then((value) => {
            this.setState({
                mobile: value.mobile,
                verifyCode: value.code
            });
        }).done();
        this.unlisten = verifyCodeStore.listen(this.onChange)
        this.unlistenSystem = systemStore.listen(this.onSystemChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenSystem();
    },
    onSystemChange: function(){
        var result = systemStore.getState();
        if (result.type != 'init') { return; };
        if (result.status != 200 && !!result.message) {
            return;
        }
        appConstants.systemInfo = result.data;
        asyncStorage.setItem('appConstants', appConstants);
        _navigator.replace({
            title: 'Launch',
            component: Launch,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        })
    },
    onChange: function() {
        var result = verifyCodeStore.getState();
        if (result.type != 'register') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        appConstants.xAuthToken = result.data;
        asyncStorage.setItem('appConstants', appConstants);
        this.getSystem();
        _navigator.immediatelyResetRouteStack([{
            title: 'Launch',
            component: Launch,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        }]);
    },
    getSystem: function(){
        this.setTimeout(()=>{
            systemAction.init();
        }, 350);
    },
    doRegister: function(){
        if (this.state.password.length < 6) {
            util.alert('密码长度不能小于6位');
            return false;
        };
        verifyCodeAction.register({
            verifyCode: this.state.verifyCode,
            mobile: this.state.mobile,
            userName: this.state.username,
            password: md5(this.state.password)
        });
    },
    onSubmitEditing: function(){
        this.doRegister();
    },
    onChangeUsernameText: function(text){
        this.setState({
            username: text
        });
    },
    onChangePasswordText: function(text){
        this.setState({
            password: text
        });
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'设置登录密码'}}
                    leftButton={<BlueBackButton navigator={_navigator} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='姓名'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeUsernameText}
                        returnKeyType={'next'} />
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='设置密码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangePasswordText}
                        returnKeyType={'done'}
                        onSubmitEditing={this.onSubmitEditing} />
                    </View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.doRegister} >
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