'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
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

var asyncStorage = require('../../common/storage');
//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var SetPassword = require('./setPassWord');

var _navigator, _topNavigator = null;
var validationCode = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            mobile: '',
            code: '',
            type: this.props.route.type,
            canReGetCode: false,
            timer: 60
        }
    },
    componentDidMount: function(){
        asyncStorage.getItem('verifyData')
        .then((value) => {
            this.setState({
                mobile: value.mobile
            });
        }).done();
        this.unlisten = verifyCodeStore.listen(this.onChange)
        this.doTimer();
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    doTimer: function(){
        this.setState({
            canReGetCode: false,
            timer: 60
        });
        this._timeInterval = this.setInterval(this._timerHandle, 1000);
    },
    _timerHandle: function(){
        if (this.state.timer == 0) {
            this.setState({
                canReGetCode: true,
                timer: 0
            });
            this.clearInterval(this._timeInterval);
            return;
        };
        this.setState({
            timer: this.state.timer-1
        });

    },
    onChange: function() {
        var result = verifyCodeStore.getState();
        if(result.type == 'isReset' && result.status != 200){
            this.clearInterval(this._timeInterval);
            this.setState({
                canReGetCode: true,
                timer: 0
            });
            return;
        }
        if (result.type == 'check') {
            if (result.status != 200 && !!result.message) {
                return;
            }
            this.clearInterval(this._timeInterval);
            asyncStorage.setItem('verifyData', {
                mobile: this.state.mobile,
                code: this.state.code,
                token: result.data
            }).then(()=>{
                _navigator.push({
                    title: 'ValidationCode',
                    type: this.state.type,
                    data: result.data,
                    component: SetPassword,
                    sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                    topNavigator: _navigator
                })
            });
         };
    },
    reGetCode: function(){
        verifyCodeAction.getVerifyCode({
            mobile: this.state.mobile,
            type: this.state.type,
            isReset: 'isReset'
        });
        this.doTimer();
    },
    doVerify: function(){
        if (!this.state.code) {
            util.alert('请输入验证码');
            return;
        };
        // var data = verifyCodeStore.getState();
        verifyCodeAction.verifyCode({
            code: this.state.code,
            mobile: this.state.mobile,
            type: this.state.type
        });
    },

    onSubmitEditing: function(){
        this.doVerify();
    },
    onChangeText: function(text){
        this.setState({
            code: text
        });
    },
    renderTimer: function(){
        if (this.state.canReGetCode) {
            return(
                <Text
                style={styles.textInputTimer}>
                </Text>
                );
        }
        return(
            <Text
            style={styles.textInputTimer}>
            剩余{this.state.timer}秒
            </Text>
            );
    },
    renderButton: function(){
        if (this.state.canReGetCode) {
            return(
                <View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.doVerify} >
                        下一步
                    </Button>
                    <Button
                        style={commonStyle.blueButton}
                        onPress={this.reGetCode} >
                            重新获取验证码
                    </Button>
                </View>
                );
        }
        return(
            <Button
            style={commonStyle.blueButton}
            onPress={this.doVerify} >
                下一步
            </Button>
            );
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'验证'}}
                    leftButton={<BlueBackButton navigator={_navigator} />} />
                <View style={styles.main}>
                    <View style={styles.phoneWrapper}>
                        <Image source={require('../../images/Send.png')}/>
                        <Text style={styles.phoneText}>{this.state.mobile}</Text>
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='请输入验证码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeText}
                        returnKeyType={'next'}
                        onSubmitEditing={this.onSubmitEditing} />
                        {this.renderTimer()}

                    </View>
                    {this.renderButton()}
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
        width: width - 32,
        alignItems: 'flex-start',
        flexDirection: 'row'
    },
    textInputTimer:{
        width: 114,
        backgroundColor: '#fff',
        position: 'absolute',
        right: 0,
        top: 12
    },
    phoneText: {
        paddingLeft: 16
    }
});



module.exports = validationCode;