'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var TimerMixin = require('react-timer-mixin');
var Actions = require('react-native-router-flux').Actions;
var underscore = require('underscore');
var {
    View,
    Text,
    Image,
    ListView,
    Switch,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var contactsStyle = require('../../../styles/contact/contactsItem');

var shareOrderAction = require('../../../actions/shareOrder/shareOrderAction');
var shareOrderStore = require('../../../stores/shareOrder/shareOrderStore');

var ShareMemberList = require('./shareMemberList');

var util = require('../../../common/util');

module.exports = React.createClass({
    mixins: [TimerMixin],
    displayName: 'orderShareSetting',
    getInitialState: function(){
        return {
            orderId: this.props.data.orderId || 0,//订单id
            falseSwitchIsOn: false,
            customers: null//订单关注数据
        }
    },
    componentDidMount: function(){
        this.unlisten = shareOrderStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function(){
        var result = shareOrderStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        };
        // console.log('-------shareOrderStore result', result.data);
        var status = (result.data.status == 1) ? true : false;
        if (result.type == 'get') {
            this.setState({
                customers: result.data.customers,
                falseSwitchIsOn: status
            });
        };
        if (result.type == 'update') {
            this.setState({
                customers: result.data.customers,
                falseSwitchIsOn: status
            });
        };
        if (result.type == 'create') {
            this.setState({
                customers: result.data.customers,
                falseSwitchIsOn: status
            });
        };
        if (result.type == 'delete') {
            this.setState({
                customers: result.data.customers,
                falseSwitchIsOn: status
            });
        };
    },
    fetchData: function(){
        shareOrderAction.get({
            orderId: this.state.orderId
        });
    },
    renderNavigator: function(){
        return(
            <NavigationBar
                title={{title: this.props.title}}
                leftButton={<BlueBackButton />} />
            );
    },
    goWeiXin: function(){
        //TODO: open wechat officialaccounts inside
        // var url = 'weixin://dl/officialaccounts';
        var url = 'weixin://';
        util.link(url);
    },
    goWebSite: function(){
        var url = 'http://www.nzaom.com/chaxun'
        util.link(url);
    },
    goAddShareMember: function(){
        Actions.addShareMember({
            orderId: this.state.orderId,
            customerUserIds: underscore.pluck(this.state.customers, 'userId')
        });
    },
    _handleSwipeout: function(rowData){
        var rawData = this.state.customers;
        if (!rawData) { rawData = [];};
        for (var i = 0; i <= rawData.length-1; i++) {
            if (rowData.userId != rawData[i].userId) {
                rawData[i].active = false
            }else{
                rawData[i].active = true
            }
        };
        this.setState({
            customers : rawData
        });
    },
    onDelete: function(data){
        shareOrderAction.delete({
            customerId: data.userId,
            orderId: this.state.orderId
        });
    },
    renderShareMemberList: function(){
        if (!this.state.customers) {
            return false;
        };
        return(
            <ShareMemberList
                _handleSwipeout={this._handleSwipeout}
                onDelete={this.onDelete}
                style={contactsStyle.scrollView}
                data={this.state.customers} />
            );
    },
    renderContent: function(){
        if (this.state.falseSwitchIsOn) {
            return(
                <View style={commonStyle.section}>
                    <Text style={commonStyle.settingGroupsTitle}>
                        查询人
                    </Text>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goAddShareMember}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../../images/common/add_circle.png')}/>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.blue]}>
                                添加查询人
                            </Text>
                        </View>
                    </TouchableHighlight>
                    {this.renderShareMemberList()}
                </View>
                )
        };
        return(
                <View style={commonStyle.section}>
                    <Text style={commonStyle.settingGroupsTitle}>
                        开启订单进度查询，并在此添加客户手机号码，您的客户便能方便查询订单进度。
                    </Text>
                    <Text style={commonStyle.settingGroupsTitle}>
                        您的客户只需要
                    </Text>
                    <Text style={commonStyle.settingGroupsTitle}>
                        关注微信服务号“<Text style={commonStyle.blue} onPress={this.goWeiXin}>你造么服务中心</Text>”，或
                    </Text>
                    <Text style={commonStyle.settingGroupsTitle}>
                        登录<Text style={commonStyle.blue} onPress={this.goWebSite}>www.nzaom.com/chaxun</Text>
                    </Text>
                </View>
            );
    },
    updateShareStatus: function(value){
        shareOrderAction.update({
            orderId: this.state.orderId,
            status: value ? 1 : 2
        });
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigator()}
                <View style={styles.main}>
                    <View
                        style={commonStyle.settingItemWrapper}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingDetail}>
                                分享订单进度
                            </Text>
                            <Switch
                                onValueChange={(value) => this.updateShareStatus(value)}
                                style={{marginBottom: 10}}
                                value={this.state.falseSwitchIsOn} />
                        </View>
                    </View>
                    {this.renderContent()}
                </View>
            </View>
            );
    }
});
