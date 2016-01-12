'use strict';
var React = require('react-native')
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var TimerMixin = require('react-timer-mixin');
import NavigationBar from 'react-native-navbar'
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
var notificationStore = require('../../stores/notification/notificationStore');

var commonStyle = require('../../styles/commonStyle');
var InboxItem = require('./inboxItem');


var SysMessage = require('./sysMessage');
var InviteMessage = require('./inviteMessage');

var util = require('../../common/util');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){

        var ds = new ListView.DataSource({
            // rowHasChanged: (r1, r2) => r1 !== r2
            rowHasChanged: (r1, r2) => true////为了在swipe的时候刷新列表
        });

        return {
            pageNum: 1,
            pageSize: 20,
            loaded : false,
            list: [],
            dataSource: ds,
            scrollEnabled: true
        }
    },
    componentDidMount: function(){
        this.onRefresh();
        this.unlisten = inboxStore.listen(this.onChange)
        this.unlistenNotification = notificationStore.listen(this.onNotificationChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenNotification();
    },
    _allowScroll: function(scrollEnabled) {
       this.setState({ scrollEnabled: scrollEnabled })
    },
    _handleSwipeout: function(rowData, sectionID, rowID){
        var rawData = this.state.list;
        for (var i = 0; i < rawData.length; i++) {
            if (rowData.msgId != rawData[i].msgId) {
                rawData[i].active = false
            }else{
                rawData[i].active = true
            }
        }

        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(rawData || [])
        });
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
    handleDelete: function(result){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(this.onRefresh, 15)
    },
    onChange: function() {
        var result = inboxStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    onNotificationChange: function(){
        var result = notificationStore.getState();
        if (result.type == 1) {
            if (this._timeout) {
                this.clearTimeout(this._timeout);
            };
            this._timeout = this.setTimeout(this.onRefresh, 15)
        };
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
    onPressRow: function(rowData, sectionID){
        switch(rowData.msgType){
            case 1:
                Actions.orderDetail({
                    data: rowData.extra.orderId
                });
                return;
            case 2:
                Actions.taskDetail({
                    data: rowData.extra.jobId
                });
                return;
            case 3:
                return;
            case 4:
                Actions.sysMessage({
                    data: rowData
                });
                return;
            case 5:
                Actions.inviteMessage({
                    data: rowData
                });
                return;
            default:
                return
        }
    },
    onUpdate: function(rowData){
        inboxAction.update({
            msgIds:[rowData.msgId],
            readStatus: rowData.readStatus
        });
    },
    onDelete: function(rowData){
        inboxAction.delete({
            msgId:rowData.msgId
        });
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <InboxItem rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            onPress={this.onPressRow}
            onDelete={this.onDelete}
            _allowScroll={this._allowScroll}
            _handleSwipeout={this._handleSwipeout}
            onUpdate={this.onUpdate} />
            )
    },
    renderInbox: function() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return this.renderListView();
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Image source={require('../../images/empty/no_message_gray.png')} />
            </View>
        )
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
                scrollEnabled={this.state.scrollEnabled}
                contentContainerStyle={{paddingBottom: 40}}
                renderEmptyRow={this.renderEmptyRow}>
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