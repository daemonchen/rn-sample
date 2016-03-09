'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
var TimerMixin = require('react-timer-mixin');
var PhonePicker = require('react-native-phone-picker');
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
var CustomerSettings = require('./customerSettings');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');

var customerListAction = require('../../actions/contact/customerListAction');
var customerListStore = require('../../stores/contact/customerListStore');
var customerStore = require('../../stores/contact/customerStore');

var util = require('../../common/util');
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
    componentDidMount: function(){
        customerListAction.getList();
        this.unlisten = customerListStore.listen(this.onChange);
        this.unlistenCustomer = customerStore.listen(this.onCustomerChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenCustomer();
    },
    onCustomerChange: function(){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            customerListAction.getList();
        },2000);
    },
    onChange: function() {
        var result = customerListStore.getState();
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
    goSetting: function(person){
        var options = {
            title: '新建客户',
            target: 1
        };

        if (!!person) {
            var phone = person.phone.replace(/[^\d]/g, '');
            var fullName = person.fullName;
            options = Object.assign(options, {
                data: {
                    userId: 0,
                    mobiles: [phone],
                    userName: fullName
                }
            });
        };
        Actions.customerSettings(options);
    },
    openAddress: function(){
        var self = this;
        PhonePicker.select(function(person) {
            if (person) {
                self.goSetting(person);
            }
        })
    },
    onSelectActionSheet: function(index){
        switch(index){
            case 0:
                return this.openAddress();
            case 1:
                return this.goSetting();
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
    actionList: ['从手机通讯录添加客户','新建客户','取消'],
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />}
                rightButton={<RightAddButton onPress={this.showActionSheet} />} />
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
            </View>
            );
    }
});
