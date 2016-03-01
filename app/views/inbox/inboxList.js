'use strict';
var React = require('react-native')
var TimerMixin = require('react-timer-mixin');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var {
    Text,
    TextInput,
    View,
    ListView,
    RefreshControl,
    Image,
    TouchableOpacity,
    AlertIOS,
    ActivityIndicatorIOS,
    StyleSheet
} = React

/**
  public final static int order_message = 1;
    public final static int invite_message = 2;
    public final static int apply_message = 3;
    public final static int system_message = 4 ;
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
        // console.log('-------inboxlist', result);
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(result.data || []),
            list: result.data || [],
            loaded     : true,
            total: result.total,
            isRefreshing: false
        });
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
            case 'deleteList':
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
            pageNum: 1,
            isRefreshing: true
        });
       inboxAction.getList({
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    onInfinite: function() {

        if (!!this.loadedAllData()) {
            return;
        };
        this.setState({
            pageNum: this.state.pageNum + 1
        });
        inboxAction.loadMore({
           pageNum: this.state.pageNum,
           pageSize: this.state.pageSize
        });
    },
    loadedAllData: function() {
        console.log('-------', this.state.list.length, this.state.total);
        return this.state.list.length >= this.state.total||this.state.list.length===0;
    },
    onPressRow: function(rowData, sectionID){
        if (!rowData.url) { return; };
        // var params = util.getParams(rowData.url.split('?')[1]);
        switch(rowData.msgType){
            case 1: //订单消息
                Actions.messageGroup(rowData);
                // Actions.orderDetail({
                //     data: rowData.extra.orderId
                // });
                return;
            case 2://邀请消息
                Actions.inviteMessage();
                return;
            case 3://申请消息
                Actions.applicationList();
                return;
            case 4://系统消息
                Actions.messageGroup(rowData);
                // Actions.sysMessage({
                //     data: rowData
                // });
                return;
            default:
                this.doDefaultAction(rowData);
                return
        }
    },
    doDefaultAction: function(rowData){
        if (/http/i.test(rowData.url)) {
            Actions.webViewWrapper({
                title: rowData.categoryName,
                descriptionUrl: rowData.url
            });
        }else{
            AlertIOS.alert(
                '更新提示',
                '您的应用版本过低，需要更新后才能打开"'+ rowData.categoryName + '"消息',
                [
                    {text: '确定', onPress: () => {
                        var url = 'https://itunes.apple.com/us/app/ni-zao-me/id1025294933?l=zh&ls=1&mt=8'
                        util.link(url)
                    } },
                    {text: '取消', onPress: () => {return}, style: 'cancel'},
                ]
            )

        }
    },
    onUpdate: function(rowData){
        inboxAction.update({
            msgIds:[rowData.msgId],
            readStatus: rowData.readStatus
        });
    },
    onDelete: function(rowData){
        console.log('---rowData', rowData);
        inboxAction.deleteList({
            categoryId:rowData.categoryId
        });
    },
    renderRow: function(rowData, sectionID, rowID) {
        // console.log('-----inbox rowData', rowData);
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
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#bdbdbd'}}>
                        您还没有消息
                </Text>
            </View>
        )
    },
    renderListView: function(){
        if (!this.state.list || this.state.list.length == 0) {
            return this.renderEmptyRow();
        };
                // onRefresh = {this.onRefresh}
                // onInfinite = {this.onInfinite}
                // loadedAllData={this.loadedAllData}
        return (
            <ListView
                ref = {(list) => {this.list= list}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                scrollEventThrottle={10}
                style={commonStyle.container}
                contentContainerStyle={{paddingBottom: 40}}
                onEndReached={this.onInfinite}
                onEndReachedThreshold={40}
                scrollEnabled={this.state.scrollEnabled}
                refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onRefresh}
                            tintColor="#969696"
                            title=""
                            colors={['#969696', '#969696', '#969696']}
                            progressBackgroundColor="#969696" />
                        }
                >
            </ListView>
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