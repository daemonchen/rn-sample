'use strict';
var React = require('react-native')
var TimerMixin = require('react-timer-mixin');
var Actions = require('react-native-router-flux').Actions;
var _ = require('underscore');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var taskListAction = require('../../../actions/task/taskListAction');
var taskListStore = require('../../../stores/task/taskListStore');
var taskStore = require('../../../stores/task/taskStore');

var util = require('../../../common/util');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var TaskDependencesItem = require('./taskDependencesItem');
var Button = require('../../../common/button.js');

/*
target: 表示从哪里打开任务列表 enum
{

    1: 'createTask',
    2: 'taskdetail',从任务详情的前置任务进入
    3: 'normal'订单详情里展示任务列表
}

taskStatus: 表示任务列表数据源
 1: 任务列表
 2: 前置任务
*/

module.exports = React.createClass({
    mixins: [TimerMixin],
    displayName: 'taskList',
    getInitialState: function(){
        var ds = new ListView.DataSource({
            // rowHasChanged: (r1, r2) => r1 !== r2
            rowHasChanged: (r1, r2) => true////为了在swipe的时候刷新列表
        }) // assumes immutable objects
            // return {dataSource: ds.cloneWithRows(ArticleStore.all())}
        return {
            taskStatus: this.props.data.taskStatus || 1,
            lastIdList: this.props.data.lastIdList || [],
            loaded : false,
            list: [],
            dataSource: ds,
            scrollEnabled: true
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onChange);
        this.unlistenTaskChange = taskStore.listen(this.onTaskChange)
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenTaskChange();
    },
    _allowScroll: function(scrollEnabled) {
       this.setState({ scrollEnabled: scrollEnabled })
    },
    _handleSwipeout: function(rowData, sectionID, rowID){
        var rawData = this.state.list;
        for (var i = 0; i < rawData.length; i++) {
            if (rowData.taskVO.taskId != rawData[i].taskVO.taskId) {
                rawData[i].active = false
            }else{
                rawData[i].active = true
            }
        }

        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(rawData || [])
        });
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
    handleGet: function(result){
        console.log('-----getDependencesList', result);
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        var list = this.transfromDataList(result.data);
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(list),
            list: list,
            loaded     : true,
            total: result.total
        });
    },
    withoutCurrentTask: function(list){
        for (var i = 0; i < list.length; i++) {
            if (list[i].taskVO.taskId == this.props.data.taskId) {
                list.splice(i, 1);
            };
        };
        return list;
    },
    transfromDataList: function(list){
        if (!list) { return []};
        list = this.withoutCurrentTask(list);
        var result = [];
        for (var i = 0; i < list.length; i++) {
            list[i].isCheck = 0;
        };
        for (var i = 0; i < list.length; i++) {
            for (var j = 0; j < this.state.lastIdList.length; j++) {
                if(this.state.lastIdList[j] == list[i].taskVO.taskId){
                    list[i].isCheck = 1;
                    result.push(list[i]);
                    // return;
                }
                // list[i].isCheck = false;
            };
        };
        // for (var i = 0; i < this.state.lastIdList.length; i++) {
        //     for (var j = 0; j < list.length; j++) {
        //         if(this.state.lastIdList[i] == list[j].taskVO.id){
        //             list[j].isCheck = true;
        //             result.push(list[j]);
        //         }else{
        //             list[j].isCheck = false;
        //         }
        //     };

        // };
        if (this.props.target == 2) {
            return result;
        }else{
            return list;
        }
    },
    handleDelete: function(result){
        if (result.status != 200 && !!result.message) {
            return;
        }
        this.setTimeout(this.fetchData, 350)
    },
    onChange: function() {
        var result = taskListStore.getState();
        // console.log('------tasklist change result', result);
        // if (result.status != 200 && !!result.message) {
        //     return;
        // }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            case 'getDependencesList':
                return this.handleGet(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    fetchData: function() {
        taskListAction.getDependencesList({
            orderId: this.props.data.orderId
        });
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <TaskDependencesItem
            rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            target={this.props.target}
            onPressRow={this.props.onPressRow}
            _allowScroll={this._allowScroll}
            _handleSwipeout={this._handleSwipeout} />
            )
    },
    render: function() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return this.renderListView();
    },
    createTask: function(){
        var data = Object.assign({taskStatus: 1}, this.props.data);
        Actions.taskSettings({
            title: '新建任务',
            data: data
        });
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Image source={require('../../../images/empty/no_task_gray.png')} />
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        您还没有前置任务
                </Text>
                <Button
                style={[commonStyle.button, commonStyle.blue]}
                onPress={this.createTask} >
                    新建任务
                </Button>
            </View>
        )
    },
    renderListView: function(){
        if (!this.state.list || this.state.list.length == 0) {
            return this.renderEmptyRow();
        };
        return (
            <ListView
              style={commonStyle.container}
              dataSource={this.state.dataSource}
              scrollEnabled={this.state.scrollEnabled}
              renderRow={this.renderRow} />
            )
    },
    renderLoadingView: function(){
        return (
            <View style={commonStyle.header}>
                <Text style={commonStyle.headerText}>User List</Text>
                <View style={commonStyle.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[commonStyle.activityIndicator]}
                        size="small" />
                </View>
            </View>
        );
    }
});