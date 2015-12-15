'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
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
var authAction = require('../../actions/user/authAction');
var authStore = require('../../stores/user/authStore');

var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var Modal = require('../../common/modal');

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
    _modal: {},
    componentDidMount: function(){
        asyncStorage.getItem('verifyData')
        .then((value) => {
            this.setState({
                mobile: value.mobile,
                verifyCode: value.code,
                token: value.token
            });
        }).done();
        this.unlisten = verifyCodeStore.listen(this.onChange)
        this.unlistenAuth = authStore.listen(this.onAuthChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenAuth();
    },
    onAuthChange: function(){
        var result = authStore.getState();
        if (result.type != 'reset') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        appConstants.xAuthToken = result.data;
        asyncStorage.setItem('appConstants', appConstants);
        this.getSystem();
        this._modal.showModal('密码设置成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            this._modal.hideModal();
        },2000);
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
        if (this.props.route.type == 1) {//注册用户
            verifyCodeAction.register({
                verifyCode: this.state.token,
                mobile: this.state.mobile,
                userName: this.state.username,
                password: md5(this.state.password)
            });
        };
        if (this.props.route.type == 2) {//重置密码
            authAction.reset({
                token: this.state.token,
                mobile: this.state.mobile,
                password: md5(this.state.password)
            });
        };
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
    renderContent: function(){
        if (this.props.route.type == 1) {//注册用户
            return(
                <View>
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
                </View>
                )
        }else{
            return(
                <View style={commonStyle.textInputWrapper}>
                    <TextInput placeholder='设置密码'
                    style={commonStyle.textInput}
                    clearButtonMode={'while-editing'}
                    onChangeText={this.onChangePasswordText}
                    returnKeyType={'done'}
                    onSubmitEditing={this.onSubmitEditing} />
                </View>
                );
        };
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'设置登录密码'}}
                    leftButton={<BlueBackButton navigator={_navigator} />} />
                <View style={styles.main}>
                    {this.renderContent()}
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.doRegister} >
                        完成
                    </Button>
                    <Text style={commonStyle.textLight}>点击注册即表示您同意《你造么用户协议》</Text>
                </View>
                <Modal ref={(ref)=>{this._modal = ref}}/>
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