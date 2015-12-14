'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    Image,
    TextInput,
    Navigator,
    TouchableHighlight,
    StyleSheet
} = React;

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');
var Modal = require('../../common/modal');

var customerAction = require('../../actions/contact/customerAction');
var customerStore = require('../../stores/contact/customerStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var _navigator, _topNavigator = null;
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        var defaultData = this.props.route.data;
        return {
            target: this.props.route.target || 1,//1: create 2: update
            id: defaultData ? defaultData.id : 0,//客户id
            userName: defaultData ? defaultData.userName :'',
            mobile: defaultData ? defaultData.mobile :'',
            company: defaultData ? defaultData.company :'',
            position: defaultData ? defaultData.position :''
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = customerStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    handleCreate: function(result){
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this._modal.showModal('添加客户成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            this._modal.hideModal();
            _navigator.pop();
        },2000);
    },
    handleDelete: function(result){
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this._modal.showModal('删除客户成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            this._modal.hideModal();
            _navigator.popToTop();
        },2000);
    },
    onChange: function() {
        var result = customerStore.getState();
        switch(result.type){
            case 'create':
                return this.handleCreate(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    onChangeNameText: function(text){
        this.setState({
            userName: text
        });
    },
    onChangeCompanyText: function(text){
        this.setState({
            company: text
        });
    },
    onChangePhoneText: function(text){
        this.setState({
            mobile: text
        });
    },
    onChangePositionText: function(text){
        this.setState({
            position: text
        });
    },
    doCommit: function(){
        if (!this.state.userName) {
            util.alert('请输入姓名');
            return;
        };
        var phone = this.state.mobile;
        if (!/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone)) {
            util.alert('手机号码格式错误');
            return;

        }
        customerAction.create({
            userName: this.state.userName,
            mobile: this.state.mobile,
            company: this.state.company,
            position: this.state.position
        });
    },
    onPressDone: function(){
        this.doCommit();
    },
    onSubmitEditing: function(){
        this.doCommit();
    },
    doDeleteCustomer: function(){
        customerAction.delete({
            id: this.state.id
        });
    },
    renderDeleteButton: function(){
        if (this.state.target == 1) {
            return(
                <View />
                );
        };
        return(
            <TouchableHighlight
                style={commonStyle.logoutWrapper}
                underlayColor='#eee'>
                <View style={commonStyle.logoutBorder}>
                    <Button
                    style={[commonStyle.button, commonStyle.red]}
                    onPress={this.doDeleteCustomer} >
                        删除客户
                    </Button>
                </View>
            </TouchableHighlight>
            );
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <Image
                          style={commonStyle.textIcon}
                          source={require('../../images/TabBar/Person.png')} />

                        <TextInput placeholder='请输入客户名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        value={this.state.userName}
                        onChangeText={this.onChangeNameText} />
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <Image
                          style={commonStyle.textIcon}
                          source={require('../../images/contact/phone-number.png')} />
                        <TextInput placeholder='请输入客户手机号码'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        value={this.state.mobile}
                        onChangeText={this.onChangePhoneText} />
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <Image
                          style={commonStyle.textIcon}
                          source={require('../../images/contact/business.png')} />
                        <TextInput placeholder='请输入客户公司'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        value={this.state.company}
                        onChangeText={this.onChangeCompanyText} />
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <Image
                          style={commonStyle.textIcon}
                          source={require('../../images/contact/position.png')} />
                        <TextInput placeholder='请输入客户职位'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        value={this.state.position}
                        onChangeText={this.onChangePositionText}
                        onSubmitEditing={this.onSubmitEditing} />
                    </View>
                    {this.renderDeleteButton()}
                    <Modal ref={(ref)=>{this._modal = ref}}/>
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    main: {
        flex: 1,
        paddingTop: 16,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});