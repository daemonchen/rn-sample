'use strict';

var React = require('react-native');
import NavigationBar from '../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
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
var Modal = require('../../common/modal');

var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            targetMobile: ''
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = employeeStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = employeeStore.getState();
        if (result.type != 'create') { return; };
        if (result.status != 200 && !!result.message) {
            return;
        }
        Actions.pop();
    },
    onChangeMobileText: function(text){
        this.setState({
            targetMobile: text
        });
    },
    doCommit: function(){
        var phone = this.state.targetMobile;
        phone = phone.replace(/[^\d]/g, '');
        employeeAction.create({
            targetMobile: phone
        });
        // if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone)) {
        // }else{
        //     util.alert('手机号码格式错误');
        // }
    },
    onPressDone: function(){
        this.doCommit();
    },
    onSubmitEditing: function(){
        this.doCommit();
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: '邀请'}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='请输入手机号码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeMobileText}
                        onSubmitEditing={this.onSubmitEditing} />
                    </View>
                    <Modal ref={(ref)=>{this._modal = ref}}/>
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