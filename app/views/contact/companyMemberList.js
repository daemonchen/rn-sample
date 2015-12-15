'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var SearchBar = require('react-native-search-bar');
var PhonePicker = require('react-native-phone-picker');
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Image,
    Navigator,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');
var ContactDetail = require('./contactDetail');
var ContactList = require('./contactList');
var InviteEmployee = require('./inviteEmployee');
var Modal = require('../../common/modal');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');

var contactAction = require('../../actions/contact/contactAction');
var contactStore = require('../../stores/contact/contactStore');

var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');

var util = require('../../common/util');
var appConstants = require('../../constants/appConstants');
/*
target: 表示从哪里打开通讯录 enum
{
    1: 'createTask',
    2: 'createOrder'
    3: 'normal'
}
*/
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            target: this.props.route.target || 3,
            listData: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        contactAction.getList();
        this.unlisten = contactStore.listen(this.onChange)
        this.unlistenEmployee = employeeStore.listen(this.onEmployeeChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenEmployee();
    },
    handleCreate: function(result){
        this._modal.showModal('邀请成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            this._modal.hideModal();
        },2000);
    },
    handleDelete: function(result){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            contactAction.getList();
        },350);
    },
    onEmployeeChange: function(){
        var result = employeeStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'create':
                return this.handleCreate(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    onChange: function() {
        var result = contactStore.getState();
        if (result.type != 'get') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this.setState({
            listData: result.data
        });
    },
    onPressRow: function(data){
        if (this.state.target == 3) {
            _topNavigator.push({
                title: data.userName,
                data: data,
                component: ContactDetail,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                topNavigator: _topNavigator
            })
            return;
        }else{
            this.props.route.onPressContactRow(data);
            _topNavigator.pop();
        }
    },
    doInviteEmployee: function(phone){
        phone = phone.replace(/[^\d]/g, '');
        if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone)) {
            employeeAction.create({
                targetMobile: phone
            });
        }else{
            util.alert('手机号码格式错误');
        }
    },
    openAddress: function(){
        var self = this;
        PhonePicker.select(function(phone) {
            if (phone) {
                self.doInviteEmployee(phone);
            }
        })
    },
    doPushInviteEmployee: function(){
        _navigator.push({
            title: '邀请',
            component: InviteEmployee,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    onSelectActionSheet: function(index){
        switch(index){
            case 0:
                return this.openAddress();
            case 1:
                return this.doPushInviteEmployee();
            default :
                return;
        }
    },
    showActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 2,
            },
            (buttonIndex) => {
              self.onSelectActionSheet(buttonIndex);
            });
    },
    actionList: ['手机通讯录邀请','手机号码邀请','取消'],
    renderNavigationBar: function(){
        var rights = appConstants.userRights.rights;
        var targetRights = appConstants.userRights.rightsMap['65536'];
        if (rights ^ targetRights == rights){
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    leftButton={<BlueBackButton navigator={_navigator}/>}
                    rightButton={<RightAddButton onPress={this.showActionSheet} />} />
                );
        }else{
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    leftButton={<BlueBackButton navigator={_navigator}/>} />
                );
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}
                automaticallyAdjustContentInsets={false} >
                    <ContactList
                        style={contactsStyle.scrollView}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
                <Modal ref={(ref)=>{this._modal = ref}}/>
            </View>
            );
    }
});
