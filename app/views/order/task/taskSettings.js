'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
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
var util = require('../../../common/util');

var Calendar = require('../../calendar');
// var Contact = require('../../contact/contact');
var SettingsWrapper = require('./settingsWrapper');
var TaskList = require('./taskList');
var TaskDetail = require('./taskDetail');
var OrderList = require('../components/orderList');
var CompanyMemberList = require('../../contact/companyMemberList');

var BlueBackButton = require('../../../common/blueBackButton');
var LeftCloseButton = require('../../../common/leftCloseButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var taskAction = require('../../../actions/task/taskAction');
var taskStore = require('../../../stores/task/taskStore');
var taskListAction = require('../../../actions/task/taskListAction');
var taskListStore = require('../../../stores/task/taskListStore');
var attachAction = require('../../../actions/attach/attachAction');
var attachStore = require('../../../stores/attach/attachStore');

var _navigator, _topNavigator = null;

/*
taskStatus:enum
1: create
2: update
3: normal
*/

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        var defaultData = this.props.route.data || {};
        return this.initTaskState(defaultData);
    },
    initTaskState: function(defaultData){
        console.log('---task setting data:', defaultData);
        if (defaultData.taskStatus == 2) {
            var endTime = defaultData.endTime || new Date().valueOf();
            var lastIds = defaultData.lastIds || [];
            return {
                taskStatus: defaultData.taskStatus || 3,
                done: defaultData.status,
                jobName: defaultData.jobName || '',
                description: defaultData.description || '',
                endTime: endTime,
                endTimeFormat: moment(endTime).format('YYYY年MM月DD日'),
                id: defaultData.id || 0,
                ownerId: defaultData.userId || 0,
                userName: defaultData.userName || '',
                lastIds: lastIds,
                lastIdsNumber: lastIds.length,
                accessoryNum: defaultData.accessoryNum || '',
                accessoryIds: defaultData.accessoryIds || []
            }
        };
        var endTime = defaultData.endTime || new Date().valueOf();
        var lastIds = defaultData.lastIds || [];
        return {
            taskStatus: defaultData.taskStatus || 3,
            orderId: defaultData.id || 0,
            ownerId: defaultData.ownerId || 0,
            userName: defaultData.userName || '',
            description: '',
            jobName: defaultData.jobName || '',
            endTime: endTime,
            endTimeFormat: moment(endTime).format('YYYY年MM月DD日'),
            lastIds: lastIds,
            lastIdsNumber: lastIds.length,
            accessoryNum: '',
            accessoryIds: []
        }
    },
    componentDidMount: function(){
        this.unlisten = taskStore.listen(this.onChange);
        this.unlistenAttach = attachStore.listen(this.onAttachChange);
        this.unlistenTaskList = taskListStore.listen(this.onTaskListChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenTaskList();
        this.unlistenAttach();
    },
    onAttachChange: function(){
        var result = attachStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (result.type == 'create') {
            // this.fetchData();
            this.setAccessoryIds(result.data);
        };
    },
    setAccessoryIds: function(data){
        this.accessoryIds = this.state.accessoryIds;
        if (!data || data.length == 0) { return; };
        if (!underscore.contains(this.accessoryIds, data[0].id)) {
            this.accessoryIds.push(data[0].id);
        }
        this.setState({
            accessoryIds: this.accessoryIds,
            accessoryNum: this.accessoryIds.length
        });
    },
    onChange: function(){
        var result = taskStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (result.type == 'create') {
            _navigator.pop();
        };
        if (result.type == 'update') {
            _navigator.pop();
        };
    },
    onTaskListChange: function(){
        var result = taskListStore.getState();
        if (result.type == 'addDependinces') {
            this.setLastIds(result)
        };
        if (result.type == 'delete') {
            _navigator.pop();
        };
    },
    onPressDone: function(){
        if (this.state.taskStatus == 2) {//修改任务
            taskAction.update({
                id: this.state.id || 0,
                ownerId: this.state.ownerId || 0,
                description: this.state.description || '',
                jobName: this.state.jobName || '',
                endTime: this.state.endTime || new Date().valueOf(),
                lastIds: this.state.lastIds || [],
                accessoryIds: this.state.accessoryIds || [],
                accessoryNum: this.state.accessoryNum || ''
            });
        }
        if (this.state.taskStatus == 1) {//新增任务
            taskAction.create({
                orderId: this.state.orderId || 0,
                ownerId: this.state.ownerId || 0,
                description: this.state.description || '',
                jobName: this.state.jobName || '',
                endTime: this.state.endTime || new Date().valueOf(),
                lastIds: this.state.lastIds || [],
                accessoryIds: this.state.accessoryIds || [],
                accessoryNum: this.state.accessoryNum || ''
            });
        };
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
    renderNavigationBar: function(){
        if (this.state.taskStatus == 2) {//修改任务
            return(
                <NavigationBar
                    title={{title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                );
        };
        return(
            <NavigationBar
                title={{title: this.props.route.title}}
                leftButton={<LeftCloseButton navigator={_topNavigator} />}
                rightButton={<RightDoneButton onPress={this.onPressDone} />} />
            );
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
    _setResponsibility: function(){
        _navigator.push({
            title:'负责人',
            component: CompanyMemberList,
            target: 1,
            onPressContactRow: this.onPressContactRow,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    _addAttachs: function(){
        var params = {};
        if (this.state.taskStatus == 1) {//如果是创建任务，则没有订任务字段
            params = {
                hostType: '2'
            }
        }else{
            params = {
                hostId: this.state.id + '',
                hostType: '2'
            }
        }
        util.showPhotoPicker({
            title: ''
        }, (response)=>{
            var name = response.uri.substring(response.uri.lastIndexOf('/') + 1)
            var uri = response.uri.replace('file://', '');
            var fileObj = Object.assign({
                count:1,
                fileOrgName: name,
                uri: uri
            }, params);
            attachAction.create(fileObj);
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
            data: rowData.id,
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
    _goOrderDetail: function(){
        _navigator.pop();
    },
    _deleteTask: function(){
        taskListAction.delete({
            orderId: this.state.orderId
        })
    },
    renderOptionalSettings: function(){
        if (this.state.taskStatus == 2) {//修改任务
            return(
                <View>
                    <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this._deleteTask}>
                        <View
                        style={commonStyle.settingItem} >
                            <Text
                            style={[commonStyle.settingTitle, commonStyle.red]}>
                                删除
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                );
        };
        return(
            <View />
            )
    },
    render: function(){
        return(
            <ScrollView keyboardShouldPersistTaps={false}
            keyboardDismissMode={'interactive'}
            style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='任务名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        value={this.state.jobName}
                        onChangeText={this.onChangeNameText} />
                    </View>
                    <View style={commonStyle.textAreaWrapper}>
                        <TextInput placeholder='任务描述'
                        style={commonStyle.textArea}
                        clearButtonMode={'while-editing'}
                        value={this.state.description}
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
                    onPress={this._setResponsibility}>
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
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._addAttachs} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                添加附件
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.accessoryNum}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                    {this.renderOptionalSettings()}
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