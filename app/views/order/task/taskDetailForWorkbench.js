'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
var moment = require('moment');
var underscore = require('underscore');
var TimerMixin = require('react-timer-mixin');
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
var util = require('../../../common/util');

var BlueBackButton = require('../../../common/blueBackButton');
var RightSettingButton = require('../../../common/rightSettingButton');

var CommentList = require('../comments/commentList');
var CommentBar = require('../comments/commentBar');

var OrderDetail = require('../orderDetail');

var taskListAction = require('../../../actions/task/taskListAction');
var taskAction = require('../../../actions/task/taskAction');
var taskStore = require('../../../stores/task/taskStore');
var TaskSettings = require('./taskSettings');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            visibleHeight: Dimensions.get('window').height,
            jobId: this.props.route.data || 0,//任务id
            taskData: {}
        }
    },
    componentDidMount: function(){
        DeviceEventEmitter.addListener('keyboardWillShow', this.keyboardWillShow);
        DeviceEventEmitter.addListener('keyboardWillHide', this.keyboardWillHide);

        this.unlisten = taskStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 550)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    fetchData: function(){
        taskAction.get({
            jobId: this.state.jobId
        });
    },
    onChange: function(){
        var result = taskStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        };
        if (result.type == 'get') {
            this.setState({
                taskData: this.transformatData(result.data)
            });
        };
    },
    transformatData: function(data){
        var endTime = data.endTime || new Date().valueOf();
        return {

            orderId: data.orderId,
            taskStatus: data.taskStatus || 0,
            done: data.status,
            jobName: data.jobName || '',
            description: data.description || '',
            endTime: endTime,
            endTimeFormat: moment(endTime).format('YYYY年MM月DD日'),
            id: data.id || 0,
            ownerId: data.ownerId || 0,
            userName: data.owner || ''
        }
    },
    keyboardWillShow: function(e) {
        var newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({visibleHeight: newSize})
    },
    keyboardWillHide: function(e) {
        this.setState({visibleHeight: Dimensions.get('window').height})
    },
    _pressSettingButton: function(){
        var data = Object.assign({taskStatus: 2}, this.state.taskData);
        _navigator.push({
            title: '任务设置',
            data: data,
            component: TaskSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    _goOrderDetail: function(){
        _navigator.push({
            title:'',
            data: this.state.taskData.orderId,
            component: OrderDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
        // _navigator.pop();
    },
    onPressCircle: function(){//更新任务状态
        var status = (this.state.done == 1) ? 0 : 1
        taskListAction.update({
            id: this.state.id,
            status: status,
        });
    },
    renderCheckIcon: function(){
        var circleImage = (this.state.taskData.done == 1) ? require('../../../images/task/task_status_done.png') : require('../../../images/task/task_status.png')
        return(
            <TouchableWithoutFeedback
            onPress={this.onPressCircle} >
                <View style={[styles.checkIconWrapper, styles.taskDetailCheckIcon]}>
                    <Image source={circleImage} />
                </View>
            </TouchableWithoutFeedback>
            )
    },
    renderCommentList: function(){
        if (!this.state.taskData.id) {
            return(
                <View />
                );
        }
        return(
            <CommentList data={this.state.taskData.id}/>
            )
    },
    renderCommentBar: function(){
        if (!this.state.taskData.id) {
            return(
                <View />
                );
        }
        return(
            <CommentBar navigator={_navigator} data={this.state.taskData.id}/>
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
                            {this.state.taskData.jobName}
                        </Text>
                        {this.renderCheckIcon()}
                    </View>
                    <View style={styles.taskDetailDescribe}>
                        <View style={commonStyle.textAreaWrapper}>
                            <Text placeholder='任务描述'
                            style={commonStyle.textArea}>
                                {this.state.taskData.description}
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
                                {this.state.taskData.endTimeFormat}
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
                                {this.state.taskData.userName}
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
                                {this.state.taskData.orderId}
                                </Text>
                                <Image
                            style={commonStyle.settingArrow}
                            source={require('../../../images/common/arrow_right.png')} />
                            </View>
                        </View>
                    </TouchableHighlight>
                    {this.renderCommentList()}
                </ScrollView>
                {this.renderCommentBar()}
            </View>
            );
    }
})