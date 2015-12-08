'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
var moment = require('moment');
var underscore = require('underscore');
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActionSheetIOS,
    DeviceEventEmitter,
    Dimensions,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

var BlueBackButton = require('../../../common/blueBackButton');
var RightSettingButton = require('../../../common/rightSettingButton');

var CommentList = require('../comments/commentList');
var CommentBar = require('../comments/commentBar');

var taskListAction = require('../../../actions/task/taskListAction');
var TaskSettings = require('./taskSettings');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        var defaultData = this.props.route.data || {};

        var endTime = defaultData.jobDO.endTime || new Date().valueOf();
        return {
            visibleHeight: Dimensions.get('window').height,

            orderId: defaultData.jobDO.orderId,
            taskStatus: defaultData.taskStatus || 0,
            done: defaultData.jobDO.status,
            jobName: defaultData.jobDO.jobName || '',
            description: defaultData.jobDO.description || '',
            endTime: endTime,
            endTimeFormat: moment(endTime).format('YYYY年MM月DD日'),
            id: defaultData.jobDO.id || 0,
            ownerId: defaultData.userVO.userId || 0,
            userName: defaultData.userVO.userName || ''
        }
    },
    componentDidMount: function(){
        DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow)
        DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide)
    },
    componentWillUnmount: function() {
    },
    keyboardWillShow: function(e) {
        var newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({visibleHeight: newSize})
    },
    keyboardWillHide: function(e) {
        this.setState({visibleHeight: Dimensions.get('window').height})
    },
    _pressSettingButton: function(){
        var data = Object.assign({taskStatus: 2}, this.props.route.data);
        _topNavigator.push({
            title: '任务设置',
            data: data,
            component: TaskSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    _goOrderDetail: function(){
        _navigator.pop();
    },
    onPressCircle: function(){//更新任务状态
        var status = (this.state.done == 1) ? 0 : 1
        taskListAction.update({
            id: this.state.id,
            status: status,
        });
    },
    renderCheckIcon: function(){
        var circleImage = (this.state.done == 1) ? require('../../../images/task/task_status_done.png') : require('../../../images/task/task_status.png')
        return(
            <TouchableWithoutFeedback
            onPress={this.onPressCircle} >
                <View style={[styles.checkIconWrapper, styles.taskDetailCheckIcon]}>
                    <Image source={circleImage} />
                </View>
            </TouchableWithoutFeedback>
            )
    },
    render: function(){
        return(
            <View style={{height: this.state.visibleHeight}} >
                <NavigationBar
                    title={{ title: '任务详情'}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightSettingButton onPress={this._pressSettingButton} />} />
                <ScrollView style={styles.main}
                keyboardDismissMode={'interactive'} >
                    <View style={styles.taskDetailTop}>
                        <Text placeholder='任务名称'
                        style={[styles.taskTitle]}>
                            {this.state.jobName}
                        </Text>
                        {this.renderCheckIcon()}
                    </View>
                    <View style={styles.taskDetailDescribe}>
                        <View style={commonStyle.textAreaWrapper}>
                            <Text placeholder='任务描述'
                            style={commonStyle.textArea}>
                                {this.state.description}
                             </Text>
                        </View>
                    </View>
                    <View
                    style={commonStyle.settingItemWrapper} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            style={commonStyle.settingTitle}>
                                截止日期
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.endTimeFormat}
                            </Text>
                        </View>
                    </View>
                    <View
                    style={commonStyle.settingItemWrapper}>
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            style={commonStyle.settingTitle}>
                                负责人
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.userName}
                            </Text>
                        </View>
                    </View>
                    <TouchableHighlight
                    underlayColor='#eee'
                    onPress={this._goOrderDetail} >
                        <View style={commonStyle.settingItemWrapper}>
                            <View
                            style={commonStyle.settingItem} >
                                <Text
                                style={commonStyle.settingTitle}>
                                    所属订单
                                </Text>
                                <Text
                                style={commonStyle.settingDetail}>
                                {this.state.orderId}
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                    <CommentList data={this.state.id}/>
                </ScrollView>
                <CommentBar navigator={_navigator} data={this.state.id}/>
            </View>
            );
    }
})