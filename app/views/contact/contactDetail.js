'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    AlertIOS,
    StyleSheet
} = React;


var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/person/style');
var util = require('../../common/util');
var appConstants = require('../../constants/appConstants');
var Button = require('../../common/button.js');

var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');

var userAction = require('../../actions/user/userAction');
var userStore = require('../../stores/user/userStore');

var customerStore = require('../../stores/contact/customerStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');

var CustomerSettings = require('./customerSettings');
var RoleSetting = require('./roleSetting');
var PositionSetting = require('./positionSetting');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            group: this.props.data.group,//1: 企业员工 2: 客户,
            data: this.props.data
        }
    },
    componentDidMount: function(){
        this.unlisten = userStore.listen(this.onChange);
        this.unlistenEmployee = employeeStore.listen(this.onEmployeeChange);
        this.unlistenCustomer = customerStore.listen(this.onCustomerChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenEmployee();
        this.unlistenCustomer();
    },
    onCustomerChange: function(){
        var result = customerStore.getState();
        switch(result.type){
            case 'update':
                return this.handleUpdate(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    handleUpdate: function(result){
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
        util.toast('修改成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            Actions.pop();
        },2000);
    },
    handleDelete: function(result){
        // console.log('------删除客户 result', result);
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
        util.toast('删除客户成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            Actions.pop();
        },2000);
    },
    onEmployeeChange: function(){
        var result = employeeStore.getState();
        if (result.type =="delete") {
            if (result.status != 200 && !!result.message) {
                return;
            }
            if (this._timeout) {
                this.clearTimeout(this._timeout);
            };
            this._timeout = this.setTimeout(()=>{
                Actions.pop();
            },350);
        };
    },
    onChange: function() {
        var result = userStore.getState();
        if (result.type == 'update') {
            if (result.status != 200 && !!result.message) {
                util.alert(result.message);
                return;
            }
            if (result.data.userId == this.state.data.userId) {
                this.props.data.roleName = result.data.roleName;
                this.props.data.position = result.data.position;
                this.setState({
                    data: this.props.data
                });
            };
        };
    },
    goSetting: function(){
        Actions.customerSettings({
            title: '编辑客户',
            target: 2,
            data: this.props.data
        });
    },
    doDeleteEmployee: function(){
        AlertIOS.alert(
            '删除成员',
            '您确定要删除成员吗',
            [
                {text: '确定', onPress: () => {
                    employeeAction.delete({
                        userId: this.state.data.userId
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )
    },
    renderNavigationBar: function(){
        if (this.state.group == 1) {//1: 企业员工
            return(
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{ title: '详细资料' }}
                    leftButton={<BlueBackButton />} />
                );

        }else{//1: 客户
            return(
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{ title: '详细资料' }}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightAddButton onPress={this.goSetting} title="编辑" />} />
                );
        }
    },
    renderAvatar: function(){
        var data = this.state.data;
        if (!data) {
            return(<View style={styles.avatarWrapper}/>);
        };
        if (data.avatar) {
            return(
                <Image
                  style={styles.avatar}
                  source={{uri: data.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: data.bgColor
            }
            return(
                <View style={[styles.avatarWrapper, circleBackground]}>
                    <Text style={styles.avatarTitle}>
                        {data.simpleUserName}
                    </Text>
                </View>
                )
        }
    },
    goRoleSetting: function(){
        Actions.roleSetting({
            title: '编辑角色',
            data: this.props.data
        });
    },
    goPositionSetting: function(){
        Actions.positionSetting({
            title: '编辑职位',
            data: this.props.data
        });
    },
    onActionSheetSelect: function(index){
        switch(index){
            case 0:
                return this.doCall();
            case 1:
                return this.doSendMsg();
            default:
                return;
        }
    },
    showActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 2,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                self.onActionSheetSelect(buttonIndex)
              // self.setState({ clicked: self.actionList[buttonIndex] });
            });
    },
    actionList: ['拨打电话','发送短信','取消'],
    doCall: function(){
        var url = '';
        if (this.state.data.mobiles && this.state.data.mobiles.length > 0) {
            url = 'tel:' + this.state.data.mobiles[0];
        };
        if (!!this.state.data.mobile) {
            url = 'tel:' + this.state.data.mobile;
        };
        console.log('------doCall', this.state.data, url);
        util.link(url);
    },
    doSendMsg: function(){
        var url = '';
        if (this.state.data.mobiles && this.state.data.mobiles.length > 0) {
            url = 'sms:' + this.state.data.mobiles[0];
        };
        if (!!this.state.data.mobile) {
            url = 'sms:' + this.state.data.mobile;
        };
        util.link(url);
    },
    renderContent: function(){
        if (this.state.group == 1) {//企业
            return(
                <View>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.showActionSheet}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                手机号码
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.blue]}>
                                {this.state.data.mobile}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goPositionSetting}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                职位
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.data.position}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goRoleSetting}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                角色
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.data.roleName}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
                )
        }
        if (this.state.group == 2) {//客户
            return(
                <View>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.showActionSheet}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                手机号码
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.blue]}>
                            {this.state.data.mobiles[0]}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                公司
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                            {this.state.data.company}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                职务
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                            {this.state.data.position}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                )
        }
        return(
            <View />
            );
    },
    renderDeleteButton: function(){
        // 524288
        var rights = appConstants.userRights.rights;
        var targetRights = 524288;
        console.log('----appConstants', appConstants.user.userName);
        console.log('----data', this.state.data.userName);
        if (this.state.group == 1) {
            if ((rights & targetRights) == targetRights){
                if (appConstants.user.userName == this.state.data.userName) {//不允许删除自己
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
                            onPress={this.doDeleteEmployee} >
                                删除成员
                            </Button>
                        </View>
                    </TouchableHighlight>
                    );

            }
        };
        return(
            <View />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.topInfo}>
                    {this.renderAvatar()}
                    <View style={styles.nameWrapper}>
                        <Text style={styles.name}>
                            {this.state.data.userName}
                        </Text>
                    </View>
                </View>
                <View style={commonStyle.settingGroups}>
                {this.renderContent()}
                {this.renderDeleteButton()}
                </View>
            </View>
            );
    }
});