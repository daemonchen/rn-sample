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
    StyleSheet
} = React;


var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/person/style');
var util = require('../../common/util');
var Button = require('../../common/button.js');

var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');
var userAction = require('../../actions/user/userAction');
var userStore = require('../../stores/user/userStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightSettingButton = require('../../common/rightSettingButton');

var CustomerSettings = require('./customerSettings');
var RoleSetting = require('./roleSetting');
var PositionSetting = require('./positionSetting');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            group: this.props.data.group,//1: 工厂员工 2: 客户,
            data: this.props.data
        }
    },
    componentDidMount: function(){
        this.unlisten = userStore.listen(this.onChange);
        this.unlistenEmployee = employeeStore.listen(this.onEmployeeChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenEmployee();
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
        employeeAction.delete({
            userId: this.state.data.userId
        });
    },
    renderNavigationBar: function(){
        if (this.state.group == 1) {//1: 工厂员工
            return(
                <NavigationBar
                    title={{ title: '详细资料' }}
                    leftButton={<BlueBackButton />} />
                );

        }else{//1: 客户
            return(
                <NavigationBar
                    title={{ title: '详细资料' }}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightSettingButton onPress={this.goSetting} />} />
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
        if (this.state.group == 1) {//工厂
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
                            source={require('../../images/common/arrow_right.png')} />
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
                            source={require('../../images/common/arrow_right.png')} />
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
        if (this.state.group == 2) {
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