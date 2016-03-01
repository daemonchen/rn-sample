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
var asyncStorage = require('../../common/storage');

var TaskList = require('./task/taskList');
var NewsList = require('./news/newsList');
var MemberList = require('./member/memberList')
var OrderSummary = require('./detail/orderSummary');
var OrderDetailSegmentControl = require('./components/orderDetailSegmentControl');

var WhiteBackButton = require('../../common/whiteBackButton');
var RightWhiteAddButton = require('../../common/rightWhiteAddButton');
var RightWhiteFollowButton = require('../../common/rightWhiteFollowButton');
var RightWhiteMoreButton = require('../../common/rightWhiteMoreButton');
var Popover = require('../../common/popover');

var util = require('../../common/util');
var attachAction = require('../../actions/attach/attachAction');
var orderStore = require('../../stores/order/orderStore');
var orderAction = require('../../actions/order/orderAction');
var taskListStore = require('../../stores/task/taskListStore');
var taskStore = require('../../stores/task/taskStore');
var followOrderAction = require('../../actions/followOrder/followOrderAction');
var followOrderStore = require('../../stores/followOrder/followOrderStore');


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
            appConstants: appConstants
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onTaskListChange);
        this.unlistenOrder = orderStore.listen(this.onOrderChange);
        this.unlistenFollow = followOrderStore.listen(this.onFollowChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchHeaderData, 350);
        util.logPage('orderDetail');
        this.getAppConstants();
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenOrder();
        this.unlistenFollow();
        util.endLogPageView('orderDetail');
    },
    getAppConstants: function(){
        var self = this;
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data && !!data.xAuthToken){
                appConstants = data;
                this.setTimeout(function(){
                    self.setState({
                        appConstants: appConstants
                    });
                }, 350)
            }
        }).done();
    },
    fetchHeaderData: function(){
        orderAction.getHeader({
            orderId: this.state.orderId
        });
    },
    onFollowChange: function(){
        var result = followOrderStore.getState();
        var orderData = this.state.orderData;
        if (result.status != 200 && !!result.message) {
            return;
        };
        if (result.type == 'update') {
            var status = !this.state.orderData.userFollow ? 1 : 0;
            var toastMessage = !!status ? '关注成功' : '您已取消关注'
            this.setState({
                orderData: Object.assign(orderData,{userFollow: status})
            });
            util.toast(toastMessage);
        };
    },
    onTaskListChange: function(){
        var result = taskListStore.getState();
        if (result.status != 200 && !!result.message) {
            // util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            this.setTimeout(this.fetchHeaderData, 350)
        };
        if (result.type == 'update') {
            this.setTimeout(this.fetchHeaderData, 350)
        };
        if (result.type == 'delete') {//任务增删改之后，重新更新一下订单首页头部信息
            if (this._timeout) {
                this.clearTimeout(this._timeout)
            };
            this._timeout = this.setTimeout(this.fetchHeaderData, 350)

        };
    },
    onOrderChange: function(){
        var result = orderStore.getState();
        var orderData = this.state.orderData;
        if (result.status != 200 && !!result.message) {
            return;
        };
        if (result.type == 'getHeader') {
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
    _saveTemplate: function(){
        Actions.orderTemplateSetting({
            title: '保存为模版',
            target: 1,//新建模版
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
    _pressFollowButton: function(){
        var status = !this.state.orderData.userFollow ? 1 : 0;
        util.logEvent('followOrder', {status: status+'', orderId: this.state.orderId});
        followOrderAction.update({
            orderId: this.state.orderId,
            status: status
        });
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
                    <RightWhiteFollowButton onPress={this._pressFollowButton} status={!!this.state.orderData.userFollow}/>
                    <RightWhiteAddButton onPress={this._pressCreateButton} />
                    <RightWhiteMoreButton onPress={this.showPopover} />
                </View>
                );
        }else{
            return(
                <View style={{flexDirection:'row'}} ref={(ref)=>{this.btn = ref;}}>
                    <RightWhiteFollowButton onPress={this._pressFollowButton} status={!!this.state.orderData.userFollow}/>
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
                hostId: this.state.orderData.orderId + '',
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
        var totaleJobNum = this.state.orderData.totaleJobNum;
        var overNum = this.state.orderData.overNum ;
        var undoNumber = totaleJobNum - overNum;
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
        if (!this.state.orderData.orderId) {
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
        // <Image
        // style={commonStyle.settingIcon}
        // source={require('../../images/order/editor_outling.png')}/>
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
                            source={require('../../images/order/editor_outling_chu.png')}/>
                            <Text
                            style={[commonStyle.settingDetail]}>
                            编辑
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
                            source={require('../../images/order/share_black_chu.png')}/>
                            <Text
                            style={[commonStyle.settingDetail]}>
                            分享
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[commonStyle.popoverWrapper, {width: 180}]}
                        underlayColor='#eee'
                        onPress={ this._saveTemplate}>
                        <View
                        style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/order/template_outline_chu.png')}/>
                            <Text
                            style={[commonStyle.settingDetail]}>
                            保存为模版
                            </Text>
                        </View>
                    </TouchableHighlight>
            </Popover>
            );
    },
    render: function(){
        var title = this.state.orderData.orderTitle || ''
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    statusBar={{style: 'light-content', hidden: false}}
                    tintColor={'#4285f4'}
                    title={{ title: '订单详情', tintColor: '#fff' }}
                    leftButton={<WhiteBackButton />}
                    rightButton={this.rightButtonConfig()} />
                <View style={styles.main}>
                    {this.renderSummary()}
                    <OrderDetailSegmentControl
                    onSegmentChange={this.onSegmentChange}/>
                    {this.renderTabContent()}
                </View>
                {this.renderPopOver()}
            </View>
            );
    }
});
