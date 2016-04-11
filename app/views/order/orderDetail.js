'use strict';
import React, {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    ActionSheetIOS,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet
} from 'react-native'
import NavigationBar from '../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var moment = require('moment');
var TimerMixin = require('react-timer-mixin');


var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');
var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');

var TaskList = require('./task/taskList');
var NewsList = require('./news/newsList');
var MemberList = require('./member/memberList')
var OrderSummary = require('./detail/orderSummary');
var OrderDetailSegmentControl = require('./components/orderDetailSegmentControl');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');
var RightEditButton = require('../../common/rightEditButton');
var RightFollowButton = require('../../common/rightFollowButton');
var RightMoreButton = require('../../common/rightMoreButton');
var Popover = require('../../common/popover');

var util = require('../../common/util');
var attachStore = require('../../stores/attach/attachStore');
var attachAction = require('../../actions/attach/attachAction');
var orderStore = require('../../stores/order/orderStore');
var orderAction = require('../../actions/order/orderAction');
var taskListStore = require('../../stores/task/taskListStore');
var taskStore = require('../../stores/task/taskStore');
var followOrderAction = require('../../actions/followOrder/followOrderAction');
var followOrderStore = require('../../stores/followOrder/followOrderStore');
var orderScheduleStore = require('../../stores/order/orderScheduleStore');


module.exports = React.createClass({
    mixins: [TimerMixin],
    displayName: 'orderDetail',
    getInitialState: function(){
        return {
            isLoad: true,
            orderId: this.props.data || 0,//订单id
            orderData: {},
            follow: false,
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
        this.unlistenTaskChange = taskStore.listen(this.onTaskChange);
        this.unlistenOrderScheduleChange = orderScheduleStore.listen(this.onOrderScheduleChange);
        this.unlistenAttach = attachStore.listen(this.onAttachChange);

        // if (this._timeout) {
        //     this.clearTimeout(this._timeout)
        // };
        this.setTimeout(this.fetchData, 350);
        //  if (this._timeout) {
        //     this.clearTimeout(this._timeout)
        // };
        this.setTimeout(this.getFollowStatus, 350);
        util.logPage('orderDetail');
        this.getAppConstants();
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenOrder();
        this.unlistenFollow();
        this.unlistenTaskChange();
        this.unlistenOrderScheduleChange();
        this.unlistenAttach()
        util.endLogPageView('orderDetail');
    },
    onAttachChange: function(){
        var result = attachStore.getState();
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        if (result.type == 'create') {
            this.setTimeout(this.fetchData, 350);
        };
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
    handleScheduleCreate: function(){
        this.setTimeout(this.fetchData, 350);
        // this.setTimeout(this.getFollowStatus, 350);
    },
    onOrderScheduleChange: function(){
        var result = orderScheduleStore.getState();
        console.log('-------create report:', result);
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'create':
                return this.handleScheduleCreate(result);
        }
    },
    onTaskChange: function(){
        var result = taskStore.getState();
        if (result.status != 200 && !!result.message) {
            // util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            this.setTimeout(this.fetchData, 350)
            // this.fetchData();
        };
        if (result.type == 'update') {
            this.setTimeout(this.fetchData, 350)
            // this.fetchData();
        };
    },
    fetchData: function(){
        if (!this.state.orderId) {return;};
        orderAction.getOrderExtra({
            orderId: this.state.orderId
        });
    },
    getFollowStatus: function(){
        if (!this.state.orderId) {return;};
        orderAction.get({
            orderId: this.state.orderId
        });
    },
    onFollowChange: function(){
        var result = followOrderStore.getState();
        var orderData = this.state.orderData;
        // console.log('------followchange', result);
        if (result.status != 200 && !!result.message) {
            return;
        };
        if (result.type == 'update') {
            var status = !this.state.follow;
            var toastMessage = !!status ? '关注成功' : '您已取消关注'
            this.setState({
                follow: status
            });
            util.toast(toastMessage);
        };
    },
    onTaskListChange: function(){
        var result = taskListStore.getState();
        // console.log('------onTaskListChange', result);
        if (result.status != 200 && !!result.message) {
            // util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            this.setTimeout(this.fetchData, 350)
        };
        if (result.type == 'update') {
            this.setTimeout(this.fetchData, 350)
        };
        if (result.type == 'delete') {//任务增删改之后，重新更新一下订单首页头部信息
            if (this._timeout) {
                this.clearTimeout(this._timeout)
            };
            this._timeout = this.setTimeout(this.fetchData, 350)

        };
    },
    onOrderChange: function(){
        var result = orderStore.getState();
        var orderData = this.state.orderData;
        // console.log('-------getOrderdata:', result);
        if (result.status != 200 && !!result.message) {
            return;
        };
        if (result.type == 'getOrderExtra') {
            this.setState({
                isLoad: false,
                orderData: Object.assign(orderData,result.data)
            });
        };
        if (result.type == 'get') {
            this.setState({
                follow: result.data.follow,
                customerName: result.data.customerName
            });
        };
        if (result.type == 'updateStatus') {
            util.toast('订单已完成');
        };
    },
    _finishOrder: function(){
        orderAction.updateStatus({
            id: this.state.orderData.orderId,
            status: 1,
        });
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
        var status = !this.state.follow;
        util.logEvent('followOrder', {status: status+'', orderId: this.state.orderId});
        if (!!status) {
            followOrderAction.follow({
                orderId: this.state.orderId
            });
        }else{
            followOrderAction.unFollow({
                orderId: this.state.orderId
            });
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
                    <RightFollowButton onPress={this._pressFollowButton} status={!!this.state.follow}/>
                    <RightAddButton onPress={this._pressCreateButton} />
                    <RightEditButton onPress={this._pressSettingButton} />
                    <RightMoreButton onPress={this.showPopover} />
                </View>
                );
        }else{
            return(
                <View style={{flexDirection:'row'}} ref={(ref)=>{this.btn = ref;}}>
                    <RightFollowButton onPress={this._pressFollowButton} status={!!this.state.follow}/>
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
            title: rowData.taskVO.taskTitle,
            data: rowData.taskVO.taskId
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
        // console.log('-----orderData', this.state.orderData);
        var time = moment(this.state.orderData.endTime).format('YYYY.MM.DD');
        var username = !!this.state.customerName ? this.state.customerName : '无客户';
        return(
            <View style={{flexDirection:'row', backgroundColor: '#fff'}}>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Image
                        style={styles.taskTotalImageTop}
                        source={require('../../images/order/schedule_gray.png')}/>
                    <Text style={[styles.taskTotalTextBottom, commonStyle.textDark]}>{this.state.orderData.overPercent}%</Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Image
                        style={styles.taskTotalImageTop}
                        source={require('../../images/order/client_gray.png')}/>
                    <Text style={[styles.taskTotalTextBottom, commonStyle.textDark]}>
                        {username}
                    </Text>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Image
                        style={styles.taskTotalImageTop}
                        source={require('../../images/order/date_gray.png')}/>
                    <Text style={[styles.taskTotalTextBottom, commonStyle.textDark]}>{time}</Text>
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
        // console.log('-----schedules in orderdetail:', this.state.orderData.schedules);

        switch(this.state.tabIndex){
            case 0:
                return(
                    <OrderSummary
                    onEmptyButtonPress={this.onAttachEmptyButtonPress}
                    isLoad={this.state.isLoad}
                    data={this.state.orderData} />
                )
            case 1:
                return(
                    <TaskList
                    onPressRow={this.onPressTaskRow}
                    data={this.state.orderData} />
                )
            case 2:
                return(
                    <MemberList
                    onPressRow={this.onPressMemberRow}
                    data={this.state.orderData} />
                )
            // case 3:
            //     return(
            //         <NewsList
            //         data={this.state.orderData} />
            //     )
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
                    // <TouchableHighlight
                    //     style={commonStyle.popoverWrapper}
                    //     underlayColor='#eee'
                    //     onPress={this._pressSettingButton}>
                    //     <View
                    //     style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                    //         <Image
                    //         style={commonStyle.settingIcon}
                    //         source={require('../../images/order/editor_outling_chu.png')}/>
                    //         <Text
                    //         style={[commonStyle.settingDetail]}>
                    //         编辑
                    //         </Text>
                    //     </View>
                    // </TouchableHighlight>
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
                        style={commonStyle.popoverWrapper}
                        underlayColor='#eee'
                        onPress={ this._finishOrder}>
                        <View
                        style={[commonStyle.popoverItem, commonStyle.bottomBorder]} >
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/order/order_finish_outline.png')}/>
                            <Text
                            style={[commonStyle.settingDetail]}>
                            完成订单
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
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor={'#f9f9f9'}
                title={{ title: '' }}
                leftButton={<BlueBackButton />}
                rightButton={this.rightButtonConfig()} />
            );
        // <NavigationBar
        //         style={{borderBottomWidth: 0}}
        //         statusBar={{style: 'light-content', hidden: false}}
        //         tintColor={'#4285f4'}
        //         title={{ title: '', tintColor: '#fff' }}
        //         leftButton={<WhiteBackButton />}
        //         rightButton={this.rightButtonConfig()} />
    },
    goRecordsSetting: function(){
        Actions.recordsSetting({
            data: this.state.orderData
        });
    },
    renderAddButton: function(){
        if (this.state.orderData.quantity == 0) {
            return(<View />);
        };
        return(
            <View style={styles.addButtonWrapper}>
                <TouchableHighlight
                    underlayColor='#eee'
                    onPress={this.goRecordsSetting}>
                    <View style={styles.addButton}>
                        <Image source={require('../../images/common/add_white.png')}/>
                    </View>
                </TouchableHighlight>
            </View>
            );
    },
    render: function(){
        var title = this.state.orderData.orderTitle || ''
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView
                stickyHeaderIndices={[2]}
                automaticallyAdjustContentInsets={false}
                style={styles.main}>
                    <Text style={styles.orderTitle}>{this.state.orderData.title}</Text>
                    {this.renderSummary()}
                    <OrderDetailSegmentControl
                    onSegmentChange={this.onSegmentChange}/>
                    {this.renderTabContent()}
                </ScrollView>
                {this.renderAddButton()}
                {this.renderPopOver()}
            </View>
            );
    }
});
