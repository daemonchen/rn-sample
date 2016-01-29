'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var md5 = require('md5');
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    TextInput,
    StyleSheet
} = React;

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');

var authAction = require('../../actions/user/authAction');
var authStore = require('../../stores/user/authStore');


var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');

var Modal = require('../../common/modal');


//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            newPwd: '',
            oldPwd: ''
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = authStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = authStore.getState();
        if (result.type != 'update') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        util.toast('修改密码成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            Actions.pop();
        },2000);
    },
    doChangePassword: function(){
        if (this.state.newPwd.length < 6 || this.state.oldPwd.length < 6) {
            util.alert('密码长度不能小于6位');
            return false;
        };
        authAction.update({
            newPwd: md5(this.state.newPwd),
            oldPwd: md5(this.state.oldPwd)
        });
    },
    onPressDone: function(){
        this.doChangePassword();
    },
    onSubmitEditing: function(){
        this.doChangePassword();
    },
    onChangePasswordText: function(text){
        this.setState({
            oldPwd: text
        });
    },
    onChangeNewPasswordText: function(text){
        this.setState({
            newPwd: text
        });
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '修改密码'}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='原密码'
                        secureTextEntry={true}
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangePasswordText} />
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='新密码'
                        secureTextEntry={true}
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeNewPasswordText}
                        onSubmitEditing={this.onSubmitEditing} />
                    </View>
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