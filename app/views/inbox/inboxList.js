'use strict';
var React = require('react-native')
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

/**
     * 订单消息

    public final static int ORDER_MESSAGE = 1;

     * 任务消息

    public final static int TASK_MESSAGE = 2;

     * 个人消息，如邀请消息

    public final static int PROFILE_MESSAGE = 3;

     * 系统消息，由你造么发送的消息

    public final static int SYSTEM_MESSAGE = 4;
*/
var inboxAction = require('../../actions/inbox/inboxAction');
var inboxStore = require('../../stores/inbox/inboxStore');

var commonStyle = require('../../styles/commonStyle');
var InboxItem = require('./inboxItem');
var _navigator, _topNavigator = null;

var OrderDetail = require('../order/orderDetail');
var TaskDetail = require('../order/task/taskDetail');
var SysMessage = require('./sysMessage');
var InviteMessage = require('./inviteMessage');

var util = require('../../common/util');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        return {
            pageNum: 1,
            pageSize: 20,
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentDidMount: function(){
        this.onRefresh();
        this.unlisten = inboxStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    handleGet: function(result){
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(result.data || []),
            list: result.data || [],
            loaded     : true,
            total: result.total
        });
        this.list.hideHeader();
        this.list.hideFooter();
    },
    handleUpdate: function(result){
        return;
    },
    handleDelete: function(result){
        return;
    },
    onChange: function() {
        var result = inboxStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            case 'update':
                return this.handleUpdate(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    onRefresh: function() {
        this.setState({
            pageNum: 1
        });
       inboxAction.getList({
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    onInfinite: function() {
        this.setState({
            pageNum: this.state.pageNum + 1
        });
        inboxAction.loadMore({
           pageNum: this.state.pageNum,
           pageSize: this.state.pageSize
        });
    },
    loadedAllData: function() {
        return this.state.list.length >= this.state.total||this.state.list.length===0;
    },
    doPush: function(component, data){
        _topNavigator.push({
            component: component,
            data: data,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    onPressRow: function(rowData, sectionID){
        switch(rowData.msgType){
            case 1:
                return this.doPush(OrderDetail, rowData.extra.orderId)
            case 2:
                return this.doPush(TaskDetail, rowData.extra.jobId)
            case 3:
                return;
            case 4:
                return this.doPush(SysMessage, rowData)
            case 5:
                return this.doPush(InviteMessage, rowData)
            default:
                return
        }
    },
    onUpdate: function(rowData){
        inboxAction.update({
            msgIds:[rowData.msgId],
            readStatus: (rowData.readStatus == 1) ? 2 : 1
        });
    },
    onDelete: function(rowData){
        inboxAction.delete({
            msgId:rowData.msgId
        });
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <InboxItem rowData={rowData} sectionID={sectionID}
            rowID={rowID}
            onPress={this.onPressRow}
            onDelete={this.onDelete}
            onUpdate={this.onUpdate} />
            )
    },
    renderInbox: function() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return this.renderListView();
    },
    renderListView: function(){
        return (
            <RefreshInfiniteListView
                ref = {(list) => {this.list= list}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                scrollEventThrottle={10}
                style={commonStyle.container}
                onRefresh = {this.onRefresh}
                onInfinite = {this.onInfinite}
                loadedAllData={this.loadedAllData}
                >
            </RefreshInfiniteListView>
            )
    },
    renderLoadingView: function(){
        return (
            <View style={commonStyle.header}>
                <Text style={commonStyle.headerText}>User List</Text>
                <View style={commonStyle.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[commonStyle.activityIndicator, {height: 80}]}
                        size="large" />
                </View>
            </View>
        );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '消息' }} />
                <View style={styles.main}>
                    {this.renderInbox()}
                </View>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main:{
        flex:1
    }
});