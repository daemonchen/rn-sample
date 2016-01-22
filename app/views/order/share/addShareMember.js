'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
var PhonePicker = require('react-native-phone-picker');
var TimerMixin = require('react-timer-mixin');
var underscore = require('underscore');
var {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var commonStyle = require('../../../styles/commonStyle');
var contactsStyle = require('../../../styles/contact/contactsItem');

var ContactList = require('../../contact/contactList');
var InviteEmployee = require('../../contact/inviteEmployee');
var Modal = require('../../../common/modal');

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var contactAction = require('../../../actions/contact/contactAction');
var contactStore = require('../../../stores/contact/contactStore');

var customerListAction = require('../../../actions/contact/customerListAction');
var customerListStore = require('../../../stores/contact/customerListStore');
var customerStore = require('../../../stores/contact/customerStore');
var shareOrderAction = require('../../../actions/shareOrder/shareOrderAction');
// var shareOrderStore = require('../../../stores/shareOrder/shareOrderStore');

var util = require('../../../common/util');
var appConstants = require('../../../constants/appConstants');
/*
target: 表示从哪里打开联系人列表 enum
{
    1: 'normal',
    2: '评论的时候@某人',
}
*/
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            orderId: this.props.orderId,
            customerUserIds: this.props.customerUserIds || [],
            listData: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        customerListAction.getList();
        this.unlisten = customerListStore.listen(this.onChange);
        this.unlistenCustomer = customerStore.listen(this.onCustomerChange);
        // this.unlistenShareMember = shareOrderStore.listen(this.onShareMemberChage);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenCustomer();
    },
    // onShareMemberChage: function(){
    //     var result = shareOrderStore.getState();
    //     if (result.type != 'get') { return; };
    //     if (result.status != 200 && !!result.message) {
    //         // util.alert(result.message);
    //         return;
    //     }
    // },
    onCustomerChange: function(){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            customerListAction.getList();
        },350);
    },
    onChange: function() {
        var result = customerListStore.getState();
        if (result.type != 'get') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this.mergeListData(result.data);
    },
    mergeListData: function(list){
        var users = [];
        var ids = this.state.customerUserIds;
        for (var i = 0; i < list.length; i++) {
            list[i].isCheck = false;
            for (var j = 0; j < ids.length; j++) {
                if (list[i].userId == ids[j]) {
                    list[i].isCheck = true;
                };

            };

        };
        this.setState({
            listData: list
        });
    },
    onPressRow: function(data){
        var ids = this.state.customerUserIds;
        if (!!data.isCheck && underscore.contains(ids, data.userId)) {//从选中状态改为为选中状态
            ids = underscore.without(ids, data.userId);
        }else{
            ids.push(data.userId);
        }
        this.setState({
            customerUserIds: ids
        });
        this.mergeListData(this.state.listData);
    },
    _pressDone: function(){
        shareOrderAction.create({
            orderId: this.state.orderId,
            customerUserIds: this.state.customerUserIds
        })
        Actions.pop();
    },
    goSetting: function(person){
        var options = {
            title: '新建客户',
            target: 1
        };

        if (!!person) {
            var phone = person.phone;
            var fullName = person.fullName;
            options = Object.assign(options, {
                data: {
                    id: 0,
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
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />}
                rightButton={<RightDoneButton onPress={this._pressDone} />} />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}
                automaticallyAdjustContentInsets={false} >
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.showActionSheet}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../../images/common/add_circle.png')}/>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.blue]}>
                                新建客户
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <ContactList
                        style={contactsStyle.scrollView}
                        target={2}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
                <Modal ref={(ref)=>{this._modal = ref}}/>
            </View>
            );
    }
});
