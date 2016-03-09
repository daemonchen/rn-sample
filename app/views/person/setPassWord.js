'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var md5 = require('md5');
var TimerMixin = require('react-timer-mixin');
var Actions = require('react-native-router-flux').Actions;
var {View,
    Text,
    Image,
    TextInput,
    StyleSheet
} = React;
var Button = require('../../common/button.js');
var commonStyle = require('../../styles/commonStyle');

var BlueBackButton = require('../../common/blueBackButton');

var verifyCodeAction = require('../../actions/user/verifyCodeAction');


var authAction = require('../../actions/user/authAction');
// var authStore = require('../../stores/user/authStore');

var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var Modal = require('../../common/modal');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var setPassWord = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            verifyCode: '',
            mobile: '',
            username: '',
            password: ''
        }
    },
    _modal: {},
    componentDidMount: function(){
        // this.unlistenAuth = authStore.listen(this.onAuthChange)
        asyncStorage.getItem('verifyData')
        .then((value) => {
            this.setState({
                mobile: value.mobile,
                verifyCode: value.code,
                token: value.token
            });
        }).done();
    },
    componentWillUnmount: function() {
        // this.unlistenAuth();
    },
    // onAuthChange: function(){
    //     var result = authStore.getState();
    //     if (result.status != 200 && !!result.message) {
    //         util.alert(result.message);
    //         return;
    //     }
    //     switch(result.type){
    //         case 'reset':
    //             return this.doReset(result);
    //         default: return;
    //     }
    // },
    // doReset: function(result){
    //     util.toast('密码设置成功,请重新登录');
    //     if (this._timeout) {
    //         this.clearTimeout(this._timeout);
    //     };
    //     this._timeout = this.setTimeout(()=>{
    //         appConstants = {};
    //         asyncStorage.setItem('appConstants', appConstants);
    //         Actions.welcome();
    //     },2000);
    // },
    doRegister: function(){
        if (this.state.password.length < 6) {
            util.toast('密码长度不能小于6位');
            return false;
        };
        if (this.props.registerType == 1) {//注册用户
            verifyCodeAction.register({
                token: this.state.token,
                mobile: this.state.mobile,
                userName: this.state.username,
                password: md5(this.state.password)
            });
        };
        if (this.props.registerType == 2) {//重置密码
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
        if (this.props.registerType == 1) {//注册用户
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
                        secureTextEntry={true}
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
                    secureTextEntry={true}
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
                    tintColor="#f9f9f9"
                    title={{title:'设置登录密码'}}
                    leftButton={<BlueBackButton />} />
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