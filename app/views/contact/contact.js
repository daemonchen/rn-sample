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
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');

var ContactGroup = require('./group');
var ContactList = require('./contactList');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');
var Popover = require('../../common/popover');

var contactAction = require('../../actions/contact/contactAction');
var contactStore = require('../../stores/contact/contactStore');
var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');

var util = require('../../common/util');
var Modal = require('../../common/modal');
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
            isVisible: false,
            buttonRect: {},
        }
    },
    _modal: {},
    componentWillMount: function(){
        this.unlisten = contactStore.listen(this.onChange);
        this.unlistenEmployee = employeeStore.listen(this.onEmployeeChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
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
        util.toast('邀请成功');
    },
    onEmployeeChange: function(){
        var result = employeeStore.getState();
        switch(result.type){
            case 'create':
                return this.handleCreate(result);
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
    goApplicationList: function(){
        Actions.applicationList();
    },
    goCustomerList: function(){
        Actions.customerList({
            title: '客户',
            target: this.state.target
        });
    },
    goCompanyMemberList: function(){
        Actions.companyMemberList({
            title: '组织架构',
            target: this.state.target
        });
    },
    goCompanyWelcom: function(){
        Actions.companyWelcome({
            title: '新建或加入工厂'
        });
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
    openCustomerAddress: function(){
        var self = this;
        PhonePicker.select(function(person) {
            if (person) {
                self.goSetting(person);
            }
        })
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
    doShare: function(){
        var userId = appConstants.user.userId;
        var userName = appConstants.user.userName;
        var factoryName = appConstants.user.factoryName;
        var link = `http:\/\/www.nzaom.com/h5/invite/${userId}`;
        var title = `邀请你加入${factoryName}`;
        var text = `${userName}在你造么上创建了一个团队-${factoryName}，邀请大家加入。` + link;
        util.presentSnsIconSheetView({
            title: title,
            text: text,
            image: 'http://img01.nzaom.com/logo-mobile-0114logo_welcom.png',
            url: link
        },function(res){
            console.log('------share done with response:', res);
        });
    },
    onSelectFactoryActionSheet: function(index){
        switch(index){
            case 0:
                return this.openAddress();
            case 1:
                return this.doPushInviteEmployee();
            case 2:
                return this.doShare();
            default :
                return;
        }
    },
    showFactoryActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.factoryActionList,
            cancelButtonIndex: 3,
            },
            (buttonIndex) => {
              self.onSelectFactoryActionSheet(buttonIndex);
            });
    },
    factoryActionList: ['手机通讯录邀请','手机号码邀请', '发送邀请链接', '取消'],
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
    onSelectCustomerActionSheet: function(index){
        switch(index){
            case 0:
                return this.openCustomerAddress();
            case 1:
                return this.goSetting();
            default :
                return;
        }
    },
    showCustomerActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.customerActionList,
            cancelButtonIndex: 2,
            },
            (buttonIndex) => {
              self.onSelectCustomerActionSheet(buttonIndex);
            });
    },
    customerActionList: ['从手机通讯录添加客户','新建客户','取消'],
    showPopover: function() {
        this.btn.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px + 40, y: py + 3, width: width, height: height}
          });
        });
    },
    closePopover: function() {
        this.setState({isVisible: false});
      },
    renderPopOver: function(){
        var {
            width, height, scale
        } = util.getDimensions();
        var displayArea = {x: 5, y: 64, width: width - 10, height: height};
        return(
            <Popover
                isVisible={this.state.isVisible}
                fromRect={this.state.buttonRect}
                displayArea={displayArea}
                placement={'bottom'}
                onClose={this.closePopover}>
                    <TouchableHighlight
                        style={commonStyle.popoverWrapper}
                        underlayColor='#eee'
                        onPress={this.showFactoryActionSheet}>
                        <View
                        style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                            <Text
                            style={[commonStyle.settingDetail]}>
                            添加成员
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.popoverWrapper}
                        underlayColor='#eee'
                        onPress={ this.showCustomerActionSheet}>
                        <View
                        style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                            <Text
                            style={[commonStyle.settingDetail]}>
                            添加客户
                            </Text>
                        </View>
                    </TouchableHighlight>
            </Popover>
            );
    },
    rightButtonConfig: function(){
        var self = this;
        var rights = appConstants.userRights.rights;
        var targetRights = 65536;
        if ((rights & targetRights) == targetRights){
            return (
                <View style={{flexDirection:'row'}} ref={(ref)=>{this.btn = ref;}}>
                    <RightAddButton onPress={this.showPopover} title='添加' />
                </View>
                );
        }else{
            return(
                <View style={{flexDirection:'row'}}>
                </View>
                )
        }

    },
    renderNavigationBar: function(){
        if (this.state.target == 3) {
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    rightButton={this.rightButtonConfig()} />
                );

        }else{
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    leftButton={<BlueBackButton />}
                    rightButton={this.rightButtonConfig()} />
                );
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}

                automaticallyAdjustContentInsets={false} >

                    <ContactGroup
                    style={styles.contactGroup}
                    goApplicationList={this.goApplicationList}
                    goCustomerList={this.goCustomerList}
                    goCompanyMemberList={this.goCompanyMemberList}
                    goCompanyWelcom={this.goCompanyWelcom} />
                    <View>
                        <Text style={[commonStyle.blue, commonStyle.title]}>
                            常用联系人
                        </Text>
                    </View>
                    <ContactList
                        style={contactsStyle.scrollView}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
                <Modal ref={(ref)=>{this._modal = ref}}/>
                {this.renderPopOver()}
            </View>
            );
    }
});

var styles = StyleSheet.create({
    contactGroup: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    }
});