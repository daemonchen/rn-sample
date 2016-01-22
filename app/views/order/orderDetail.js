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
    TouchableHighlight,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');
var appConstants = require('../../constants/appConstants');

var TaskList = require('./task/taskList');
var NewsList = require('./news/newsList');
var MemberList = require('./member/memberList')
var OrderSummary = require('./detail/orderSummary');
var OrderDetailSegmentControl = require('./components/orderDetailSegmentControl');

var WhiteBackButton = require('../../common/whiteBackButton');
var RightWhiteAddButton = require('../../common/rightWhiteAddButton');
var RightWhiteSettingButton = require('../../common/rightWhiteSettingButton');
var Popover = require('../../common/popover');

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
            images: [],
            isVisible: false,
            buttonRect: {},
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
    _goShareSetting: function(){
        // orderShareSetting
        // var data = Object.assign({orderStatus: 2}, this.state.orderData);
        Actions.orderShareSetting({
            // title: '设置订单',
            data: this.state.orderData
        });
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
                <View style={{flexDirection:'row'}} ref={(ref)=>{this.btn = ref;}}>
                    <RightWhiteAddButton onPress={this._pressCreateButton} />
                    <RightWhiteSettingButton onPress={this.showPopover} />
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
                    <OrderSummary
                    onEmptyButtonPress={this.onAttachEmptyButtonPress}
                    data={this.state.orderData}
                    hostType={1} />
                )
            case 2:
                return(
                    <MemberList
                    onPressRow={this.onPressMemberRow}
                    data={this.state.orderData} />
                )
            case 3:
                return(
                    <NewsList
                    data={this.state.orderData} />
                )
            default:
                return(
                    <View />
                )
        }
    },
    showPopover: function() {
        this.btn.measure((ox, oy, width, height, px, py) => {
            this.setState({
                isVisible: true,
                buttonRect: {x: px + 20, y: py - 64, width: width, height: height}
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
        var displayArea = {x: 5, y: 20, width: width - 10, height: height - 25};
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
                        onPress={this._pressSettingButton}>
                        <View
                        style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/person/feedback.png')}/>
                            <Text
                            style={[commonStyle.settingDetail]}>
                            编辑
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.popoverWrapper}
                        underlayColor='#eee' >
                        <View
                        style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/person/feedback.png')}/>
                            <Text
                            style={[commonStyle.settingDetail]}>
                            关注
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.popoverWrapper}
                        underlayColor='#eee'
                        onPress={ this._goShareSetting}>
                        <View
                        style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/person/feedback.png')}/>
                            <Text
                            style={[commonStyle.settingDetail]}>
                            分享
                            </Text>
                        </View>
                    </TouchableHighlight>
            </Popover>
            );
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
                    {this.renderPopOver()}
                </View>
            </View>
            );
    }
});
