'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
var PhonePicker = require('react-native-phone-picker');
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');

var ContactDetail = require('./contactDetail');
var ContactList = require('./contactList');

var Modal = require('../../common/modal');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');
var RightMoreButton = require('../../common/rightMoreButton');

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
        return {
            target: this.props.target || 3,
            listData: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = contactStore.listen(this.onChange);
        this.unlistenEmployee = employeeStore.listen(this.onEmployeeChange);
        if (this._timeout) {this.clearTimeout(this._timeout)};
        this._timeout = this.setTimeout(this.fetchData, 350);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenEmployee();
    },
    fetchData: function(){
        contactAction.getList();
    },
    handleCreate: function(result){
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this._modal.showModal('邀请成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            this._modal.hideModal();
        },2000);
    },
    handleDelete: function(result){
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(this.fetchData,350);
    },
    handleAgreeApplication: function(result){
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(this.fetchData,350);
    },
    onEmployeeChange: function(){
        var result = employeeStore.getState();
        switch(result.type){
            case 'create':
                return this.handleCreate(result);
            case 'delete':
                return this.handleDelete(result);
            case 'agreeApplication':
                return this.handleAgreeApplication(result);
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
            Actions.contactDetail({
                title: data.userName,
                data: data
            });
            return;
        }else{
            this.props.onPressContactRow(data);
            Actions.pop();
        }
    },
    doInviteEmployee: function(person){
        var phone = person.phone.replace(/[^\d]/g, '');
        // if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone)) {
        // }else{
        //     util.alert('手机号码格式错误');
        // }
        employeeAction.create({
            targetMobile: phone
        });
    },
    openAddress: function(){
        var self = this;
        PhonePicker.select(function(person) {
            if (person) {
                self.doInviteEmployee(person);
            }
        })
    },
    doPushInviteEmployee: function(){
        Actions.inviteEmployee({
            title: '邀请'
        });
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
    goCompanySetting: function(){
        Actions.companySettings({
            title: '设置'
        });
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
    rightButtonConfig: function(){
        var self = this;
        var rights = appConstants.userRights.rights;
        var targetRights = 65536;
        if ((rights & targetRights) == targetRights){
            return (
                <View style={{flexDirection:'row'}} ref={(ref)=>{this.btn = ref;}}>
                    <RightAddButton onPress={this.showActionSheet} />
                    <RightMoreButton onPress={this.goCompanySetting} />
                </View>
                );
        }else{
            return(
                <View style={{flexDirection:'row'}}>
                    <RightMoreButton onPress={this.goCompanySetting} />
                </View>
                )
        }

    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />}
                rightButton={this.rightButtonConfig()} />
            );
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
