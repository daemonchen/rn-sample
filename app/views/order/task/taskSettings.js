'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var moment = require('moment');
var underscore = require('underscore');
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    Navigator,
    TouchableHighlight,
    StyleSheet
} = React

var commonStyle = require('../../../styles/commonStyle');

var Calendar = require('../../calendar');
var Contact = require('../../contact/contact');
var SettingsWrapper = require('./settingsWrapper');
var TaskList = require('./taskList');
var TaskDetail = require('./taskDetail');
var OrderList = require('../components/orderList');

var LeftCloseButton = require('../../../common/leftCloseButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var taskAction = require('../../../actions/task/taskAction');
var taskStore = require('../../../stores/task/taskStore');
var taskListStore = require('../../../stores/task/taskListStore');

var _navigator, _topNavigator = null;

/*
taskStatus:enum
0: create
1: update
2: normal
*/

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        var defaultData = this.props.route.data || {};
        var endTime = defaultData.endTime || new Date().valueOf();
        var lastIds = defaultData.lastIds || [];
        return {
            taskStatus: defaultData.taskStatus || 0,
            orderId: defaultData.id || 0,
            userName: defaultData.userName || '',
            ownerId: defaultData.ownerId || 0,
            userName: defaultData.userName || '',
            description: defaultData.description || '',
            jobName: defaultData.jobName || '',
            endTime: endTime,
            endTimeFormat: moment(endTime).format('YYYY年MM月DD日'),
            lastIds: lastIds,
            lastIdsNumber: lastIds.length
        }
    },
    componentDidMount: function(){
        this.unlisten = taskStore.listen(this.onChange);
        this.unlistenTaskList = taskListStore.listen(this.onTaskListChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenTaskList();
    },
    onChange: function(){
        var result = taskStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            _navigator.pop();
        };
    },
    onTaskListChange: function(){
        var result = taskListStore.getState();
        if (result.type == 'addTask') {
            this.setLastIds(result)
        };
    },
    onPressDone: function(){
        taskAction.create({
            orderId: this.state.orderId || 0,
            ownerId: this.state.ownerId || 0,
            description: this.state.description || '',
            jobName: this.state.jobName || '',
            endTime: this.state.endTime || new Date().valueOf(),
            lastIds: this.state.lastIds || []
        });
    },
    onChangeNameText: function(text){
        this.setState({
            jobName: text
        });
    },
    onChangeDescribeText: function(text){
        this.setState({
            description: text
        });
    },
    _setEndTime: function(){
        _navigator.push({
            component: Calendar,
            target: 1,
            onCalendarPressDone: this.onCalendarPressDone,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    _setCustomer: function(){
        _navigator.push({
            title:'客户',
            component: Contact,
            target: 1,
            onPressContactRow: this.onPressContactRow,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    onCalendarPressDone: function(date){
        this.setState({
            endTime: moment(date).valueOf(),
            endTimeFormat: moment(date).format('YYYY年MM月DD日')
        });
    },
    onPressContactRow: function(data){
        this.setState({
            ownerId: data.userId,
            userName: data.userName
        });
    },
    onPressTaskRow: function(rowData){
        _topNavigator.push({
            title: rowData.name,
            component: TaskDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    setLastIds: function(data){
        this.lastIds = this.state.lastIds;
        if (!!data.isCheck && !underscore.contains(this.lastIds, data.id)) {
            this.lastIds.push(data.id);
        }else{
            this.lastIds = underscore.without(this.lastIds, data.id);
        }
    },
    onTaskPressDone: function(){
        this.setState({
            lastIds: this.lastIds,
            lastIdsNumber: this.lastIds.length
        });
    },
    _setTaskDependence: function(){
        //todo: 把settingwrapper修改为presettings
        _navigator.push({
            title:'前置任务',
            component: SettingsWrapper,
            children: TaskList,
            target: 1,
            data: this.props.route.data,
            onPressRow: this.onPressTaskRow,
            onPressDone: this.onTaskPressDone,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    render: function(){
        return(
            <ScrollView keyboardShouldPersistTaps={false}
            style={commonStyle.container}>
                <NavigationBar
                    title={{title:'新建任务'}}
                    leftButton={<LeftCloseButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='任务名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeNameText} />
                    </View>
                    <View style={commonStyle.textAreaWrapper}>
                        <TextInput placeholder='任务描述'
                        style={commonStyle.textArea}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeDescribeText}
                        multiline={true} />
                    </View>
                    <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this._setEndTime}>
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
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this._setCustomer}>
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
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this._setTaskDependence} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            style={commonStyle.settingTitle}>
                                前置任务
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.lastIdsNumber}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
            </ScrollView>
            );
    }
});

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});