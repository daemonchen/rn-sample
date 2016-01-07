'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var moment = require('moment');
var TimerMixin = require('react-timer-mixin');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    ActionSheetIOS,
    TouchableOpacity,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');
var appConstants = require('../../constants/appConstants');

var TaskList = require('./task/taskList');
var NewsList = require('./news/newsList');
var MemberList = require('./member/memberList')
var ContactDetail = require('../contact/contactDetail');
var TaskSettings = require('./task/taskSettings');
var AttachList = require('./attach/attachList');
var AttachDetail = require('./attach/attachDetail');
var OrderDetailSegmentControl = require('./components/orderDetailSegmentControl');
var OrderSettings = require('./orderSettings');

var WhiteBackButton = require('../../common/whiteBackButton');
var RightWhiteAddButton = require('../../common/rightWhiteAddButton');
var RightWhiteSettingButton = require('../../common/rightWhiteSettingButton');

var util = require('../../common/util');
var attachAction = require('../../actions/attach/attachAction');
var orderStore = require('../../stores/order/orderStore');
var orderAction = require('../../actions/order/orderAction');
var taskListStore = require('../../stores/task/taskListStore');


module.exports = React.createClass({
    mixins: [TimerMixin],
    displayName: 'orderDetail',
    getInitialState: function(){
        return {
            orderId: this.props.data || 0,//订单id
            orderData: {},
            tabIndex: 0,
            images: []
        }
    },
    componentDidMount: function(){
        this.unlistenOrder = orderStore.listen(this.onOrderChange);
        this.unlisten = taskListStore.listen(this.onTaskListChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlistenOrder();
        this.unlisten();
    },
    fetchData: function(){
        orderAction.get({
            orderId: this.state.orderId
        });
    },
    onTaskListChange: function(){
        var result = taskListStore.getState();
        var orderData = this.state.orderData;
        if (result.status != 200 && !!result.message) {
            return;
        };
        if (result.type == 'get') {
            this.setState({
                orderData: Object.assign(orderData,result.data)
            });
        };
    },
    onOrderChange: function(){
        var result = orderStore.getState();
        var orderData = this.state.orderData;
        if (result.status != 200 && !!result.message) {
            return;
        };
        if (result.type == 'get') {
            this.setState({
                orderData: Object.assign(orderData,result.data)
            });
        };
    },
    _pressSettingButton: function(){
        var data = Object.assign({orderStatus: 2}, this.state.orderData);
        Actions.orderSettings({
            title: '设置订单',
            data: data
        });
    },
    createTask: function(){
        var data = Object.assign({taskStatus: 1}, this.state.orderData);
        Actions.taskSettings({
            title: '新建任务',
            data: data
        });
    },
    onActionSelect: function(index){
        switch(index){
            case 0:
                return this.createTask();
            case 1:
                return this.showCameraRoll();
            default:
                return
        }
    },
    _pressCreateButton: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 2,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                self.onActionSelect(buttonIndex)
              // self.setState({ clicked: self.actionList[buttonIndex] });
            });
    },
    actionList: ['新建任务','上传附件','取消'],
    rightButtonConfig: function(){
        var self = this;
        var rights = appConstants.userRights.rights;
        var targetRights = 8;
        if ((rights & targetRights) == targetRights){
            return (
                <View style={{flexDirection:'row'}}>
                    <RightWhiteAddButton onPress={this._pressCreateButton} />
                    <RightWhiteSettingButton onPress={this._pressSettingButton} />
                </View>
                );
        }else{
            return(
                <View style={{flexDirection:'row'}}>
                </View>
                )
        }

    },
    onPressMemberRow: function(rowData, sectionID){
        Actions.contactDetail({
            title: rowData.userName,
            data: rowData
        });
    },
    onPressTaskRow: function(rowData, sectionID){
        Actions.taskDetail({
            title: rowData.jobDO.jobName,
            data: rowData.jobDO.id
        });
    },
    onPressAttachRow: function(rowData,sectionID){
        Actions.attachDetail({
            title: '附件详情',
            data: rowData
        });
    },
    showCameraRoll: function(){
        util.showPhotoPicker({
            title: '',
            noData: true,
        }, (response)=>{
            var name = response.uri.substring(response.uri.lastIndexOf('/') + 1)
            var uri = response.uri.replace('file://', '');
            attachAction.create({
                count: 1,
                hostId: this.state.orderData.id + '',
                hostType: '1',
                fileOrgName: name,
                uri: uri});
        });
    },
    onAttachEmptyButtonPress: function(){
        this.showCameraRoll();
    },
    onSegmentChange: function(event){
        this.setState({
            tabIndex: event.nativeEvent.selectedSegmentIndex
        })
    },
    renderSummary: function(){
        var time = moment(this.state.orderData.endTime).format('YYYY.MM.DD');
        var jobNum = !!this.state.orderData.jobNum ? this.state.orderData.jobNum : 0;
        var overNum = !!this.state.orderData.overNum ? this.state.orderData.overNum : 0;
        var undoNumber = !!this.state.orderData.overNum ? (jobNum - overNum) : 0;
        return(
            <View style={{flexDirection:'row', height: 68, backgroundColor: '#4285f4'}}>
                <View style={{flex: 1}}>
                    <Text style={styles.taskTotalText}>{overNum}</Text>
                    <Text style={styles.taskTotalText}>已完成</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.taskTotalText}>{undoNumber}</Text>
                    <Text style={styles.taskTotalText}>未完成</Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={styles.taskTotalText}>{time}</Text>
                    <Text style={styles.taskTotalText}>截止日</Text>
                </View>
            </View>
            );
    },
    renderTabContent: function(){
        if (!this.state.orderData.id) {
            return(
                <View />
                );
        };
        switch(this.state.tabIndex){
            case 0:
                return(
                    <TaskList
                    onPressRow={this.onPressTaskRow}
                    data={this.state.orderData} />
                )
            case 1:
                return(
                    <NewsList
                    data={this.state.orderData} />
                )
            case 2:
                return(
                    <MemberList
                    onPressRow={this.onPressMemberRow}
                    data={this.state.orderData} />
                )
            case 3:
                return(
                    <AttachList
                    onPressRow={this.onPressAttachRow}
                    onEmptyButtonPress={this.onAttachEmptyButtonPress}
                    data={this.state.orderData}
                    hostType={1} />
                )
            default:
                return(
                    <View />
                )
        }
    },
    render: function(){
        var title = this.state.orderData.title || ''
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    statusBar={{style: 'light-content', hidden: false}}
                    tintColor={'#4285f4'}
                    title={{ title: title, tintColor: '#fff' }}
                    leftButton={<WhiteBackButton />}
                    rightButton={this.rightButtonConfig()} />
                <View style={styles.main}>
                    {this.renderSummary()}
                    <OrderDetailSegmentControl
                    onSegmentChange={this.onSegmentChange}/>
                    {this.renderTabContent()}
                </View>
            </View>
            );
    }
});
