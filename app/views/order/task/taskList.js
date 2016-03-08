'use strict';
var React = require('react-native')
var TimerMixin = require('react-timer-mixin');
var Actions = require('react-native-router-flux').Actions;
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
var TaskItem = require('./taskItem');
var Button = require('../../../common/button.js');


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
            loaded : false,
            list: this.props.data.tasks || [],
            dataSource: ds,
            scrollEnabled: true
        }
    },
    componentDidMount: function(){
        // this.unlisten = taskListStore.listen(this.onChange);
        this.setTaskListState();
    },
    componentWillUnmount: function() {
        // this.unlisten();
    },
    componentWillReceiveProps: function(nextProps){
        var list = nextProps.data.tasks || [];
        this.setState({
            list: list,
            dataSource : this.state.dataSource.cloneWithRows(list),
            loaded     : true,
        });
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

    setTaskListState: function(result){
        var list = this.state.list;
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(list),
            loaded     : true,
        });
    },

    renderRow: function(rowData, sectionID, rowID) {
        return (
            <View>
                <TaskItem
                rowData={rowData}
                sectionID={sectionID}
                rowID={rowID}
                onPressRow={this.props.onPressRow}
                _allowScroll={this._allowScroll}
                _handleSwipeout={this._handleSwipeout} />
            </View>
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
                        您还没有任务
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