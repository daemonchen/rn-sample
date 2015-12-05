'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var moment = require('moment');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    ActionSheetIOS,
    TouchableOpacity,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');

var TaskList = require('./task/taskList');
var TaskDetail = require('./task/taskDetail');
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
var taskListStore = require('../../stores/task/taskListStore');
var attachAction = require('../../actions/attach/attachAction');

var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            overNum: 0,
            endTime: new Date(),
            totaleJobNum: 0,
            tabIndex: 0,
            images: []
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    handleGet: function(result){
        if (result.status != 200 && !!result.message) {
            return;
        };
        this.setState({
            overNum: result.data.overNum,
            endTime: result.data.endTime,
            totaleJobNum: result.data.totaleJobNum
        });
    },
    onChange: function() {
        var result = taskListStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            // case 'delete':
            //     return this.handleDelete(result);
        }
    },
    _pressSettingButton: function(){
        _topNavigator.push({
            data: {orderStatus: 0},
            component: OrderSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    createTask: function(){
        _topNavigator.push({
            component: TaskSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    createMember: function(){
        console.log('---create new member for this order');
    },
    onActionSelect: function(index){
        switch(index){
            case 0:
                return this.createTask();
            case 1:
                return this.createMember();
            case 2:
                return this.showCameraRoll();
            default:
                return
        }
    },
    _pressCreateButton: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 3,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                self.onActionSelect(buttonIndex)
              // self.setState({ clicked: self.actionList[buttonIndex] });
            });
    },
    actionList: ['新建任务','添加成员','上传附件','取消'],
    rightButtonConfig: function(){
        var self = this;
        return(
            <View style={{flexDirection:'row'}}>
                <RightWhiteAddButton onPress={this._pressCreateButton} />
                <RightWhiteSettingButton onPress={this._pressSettingButton} />
            </View>
            );
    },
    onPressMemberRow: function(rowData, sectionID){
        _topNavigator.push({
            title: rowData.userName,
            data: rowData,
            component: ContactDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    onPressTaskRow: function(rowData, sectionID){
        _topNavigator.push({
            title: rowData.name,
            component: TaskDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    onPressCircle: function(rowData, sectionID){
        console.log('todo: update task list stuff');
    },
    onPressAttachRow: function(rowData,sectionID){
        _topNavigator.push({
            title: '附件详情',
            data: rowData,
            component: AttachDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    showCameraRoll: function(){
        util.showPhotoPicker({
            title: ''
        }, (response)=>{
            var name = response.uri.substring(response.uri.lastIndexOf('/') + 1)
            attachAction.create([{
                hostId: this.props.route.data.id,
                hostType: 1,
                base64: response.data,
                fileName: name}]);
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
        var time = moment(this.state.endTime).format('YYYY.MM.DD');
        var undoNumber = this.state.totaleJobNum - this.state.overNum;
        return(
            <View style={{flexDirection:'row', height: 68, backgroundColor: '#4285f4'}}>
                <View style={{flex: 1}}>
                    <Text style={styles.taskTotalText}>{this.state.overNum}</Text>
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
        switch(this.state.tabIndex){
            case 0:
                return(
                    <TaskList
                    onPressRow={this.onPressTaskRow}
                    data={this.props.route.data} />
                )
            case 1:
                return(
                    <TaskList
                    onPressRow={this.onPressTaskRow}
                    data={this.props.route.data} />
                )
            case 2:
                return(
                    <MemberList
                    onPressRow={this.onPressMemberRow}
                    data={this.props.route.data} />
                )
            case 3:
                return(
                    <AttachList
                    onPressRow={this.onPressAttachRow}
                    onEmptyButtonPress={this.onAttachEmptyButtonPress}
                    data={this.props.route.data} />
                )
            default:
                return(
                    <View />
                )
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    statusBar={{style: 'light-content', hidden: false}}
                    tintColor={'#4285f4'}
                    title={{ title: this.props.route.title, tintColor: '#fff' }}
                    leftButton={<WhiteBackButton navigator={_topNavigator} />}
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
