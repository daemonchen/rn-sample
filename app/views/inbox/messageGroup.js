'use strict';
var React = require('react-native')
var _ = require('underscore');
var TimerMixin = require('react-timer-mixin');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    RefreshControl,
    Image,
    TouchableOpacity,
    ActivityIndicatorIOS,
    AlertIOS,
    StyleSheet
} = React
/**
     * 订单消息

    public final static int ORDER_MESSAGE = 1;
    /**
     * 任务消息

    public final static int TASK_MESSAGE = 2;
    /**
     * 个人消息

    public final static int PROFILE_MESSAGE = 3;
    /**
     * 系统消息，由你造么发送的消息

    public final static int SYSTEM_MESSAGE = 4;
    /**
     * 邀请消息

    public final static int INVITED_MESSAGE = 5;
    /**
     * 申请消息

    public final static int APPLY_MESSAGE = 6;
 */

var inboxAction = require('../../actions/inbox/inboxAction');
var inboxStore = require('../../stores/inbox/inboxStore');
var notificationStore = require('../../stores/notification/notificationStore');

var commonStyle = require('../../styles/commonStyle');
var MessageGroupItem = require('./messageGroupItem');

var BlueBackButton = require('../../common/blueBackButton');

var InvertibleScrollView = require('../../common/invertibleScrollView.js');

var util = require('../../common/util');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
            // rowHasChanged: (r1, r2) => true////为了在swipe的时候刷新列表
        });

        return {
            pageNum: 1,
            pageSize: 20,
            loaded : false,
            list: [],
            dataSource: ds,
            scrollEnabled: true,
            isRevert: true
        }
    },
    lastItemHeight: 0,
    scrollViewHeight: 0,
    componentDidMount: function(){
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.onRefresh, 350)
        this.unlisten = inboxStore.listen(this.onChange)
        // this.unlistenNotification = notificationStore.listen(this.onNotificationChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        // this.unlistenNotification();
    },
    // componentDidUpdate: function(){
    //     this.scrollToBottom();
    // },
    scrollToBottom: function(){
        var self = this;
        if (!!this.hasScrollToBottom) {return;};
        if (!!this._scrollView) {
            console.log('-----this._scrollView', this.footerY, this.lastItemHeight);
            if (!this.scrollViewHeight) {
                this.setTimeout(()=>{
                    this.scrollToBottom();
                }, 350);
                return false;
            };
            if (this.footerY - this.scrollViewHeight > 0) {
                this.hasScrollToBottom = true;
                this._scrollView.scrollTo({x:0, y: this.footerY - this.scrollViewHeight, animated: true})
            };
        };
    },
    doReLayout: function(obj){
        this.scrollViewHeight = obj.nativeEvent.layout.height -16;
    },
    doAddItemHeight: function(obj, index){
        if (index == this.state.list.length - 1) {
            this.lastItemHeight = obj.nativeEvent.layout.height;
        };
        console.log('----doAddItemHeight', this.lastItemHeight);
    },
    handleGet: function(result){
        // console.log('-------messageListCategory', result);
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                isRefreshing: false,
                list: []
            })
            return;
        }
        var dataList = result.data || [];
        this.setState({
            // dataSource : this.state.dataSource.cloneWithRows(result.data || []),
            list: dataList,
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
            case 'getMessageOrder':
                return this.handleGet(result);
            case 'getMessageSystem':
                return this.handleGet(result);
            case 'delete':
                return this.handleDelete(result);
        }
    },
    onRefresh: function() {
        this.setState({
            pageNum: 1,
            isRefreshing: true
        });
        if (this.props.msgType == 1) {//订单消息
            var params = util.getParams(this.props.url.split('?')[1]);
            var options = Object.assign(params, {
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
            inboxAction.getMessageOrder(options);
        };
        if (this.props.msgType == 4) {//系统消息
            inboxAction.getMessageSystem({
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
        };

    },
    onInfinite: function() {
        this.setState({
            pageNum: this.state.pageNum + 1,
            isRefreshing: true
        });
        if (this.props.msgType == 1) {//订单消息
            var params = util.getParams(this.props.url.split('?')[1]);
            var options = Object.assign(params, {
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
            inboxAction.loadMoreMessageOrder(options);
        };
        if (this.props.msgType == 4) {//系统消息
            inboxAction.loadMoreMessageSystem({
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
        };
    },
    loadedAllData: function() {
        // console.log('-------', this.state.list.length, this.state.total);
        return this.state.list.length >= this.state.total||this.state.list.length===0;
    },
    onPressRow: function(rowData){
        console.log('----press ', rowData);
        if (!rowData.url) { return; };
        var params = util.getParams(rowData.url.split('?')[1]);
        console.log('-----params', params);
        switch(rowData.msgSubType){
            case 1:
                Actions.orderDetail({
                    data: params.orderId
                });
                return;
            case 2:
                Actions.taskDetail({
                    data: params.taskId
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
            case 6:
                Actions.applicationList();
                return;
            default:
                this.doDefaultAction(rowData);
                return
        }
    },
    doDefaultAction: function(rowData){
        if (/http/i.test(rowData.url)) {
            Actions.taskDescribe({
                title: rowData.msgContent,
                descriptionUrl: rowData.url
            });
        }else{
            AlertIOS.alert(
                '更新提示',
                '您的应用版本过低，需要更新后才能打开"'+ rowData.msgContent + '"消息',
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
    onDelete: function(rowData){
        inboxAction.delete({
            msgId:rowData.msgId
        });
    },
    renderRow: function(rowData, index) {
        // onLayout={(obj)=>{this.doAddItemHeight(obj, index)}}
        // console.log('---rowData', rowData, index);
        return (
            <MessageGroupItem
            key={index}
            rowData={rowData}
            msgType={this.props.msgType}
            onPress={this.onPressRow}
            onDelete={this.onDelete} />
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
    renderItems: function(){
        var self = this;
        var dataList = this.state.list;
        return _.map(dataList, function(item, key){
            return self.renderRow(item, key);
        });
    },
    renderListView: function(){
        if (!this.state.list || this.state.list.length == 0) {
            return this.renderEmptyRow();
        };
        if (!!this.loadedAllData()) {
            return(
                <ScrollView ref={component => this._scrollView = component}
                contentContainerStyle={{paddingBottom: 16}}
                onLayout={this.doReLayout}
                style={commonStyle.container} >
                    {this.renderItems()}
                    <View onLayout={(e)=> {
                      this.footerY = e.nativeEvent.layout.y;
                      console.log('-----this._scrollViewww', this.footerY);
                      this.scrollToBottom();
                      }}/>
                </ScrollView>
                );
        };
        return(
            <ScrollView ref={component => this._scrollView = component}
            contentContainerStyle={{paddingBottom: 16}}
            onLayout={this.doReLayout}
            style={commonStyle.container}
            refreshControl={
                          <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onInfinite}
                            tintColor="#969696"
                            title=""
                            colors={['#969696', '#969696', '#969696']}
                            progressBackgroundColor="#969696" />
                        }
                >
                {this.renderItems()}
                <View onLayout={(e)=> {
                  this.footerY = e.nativeEvent.layout.y;
                  console.log('-----this._scrollViewww', this.footerY);
                  this.scrollToBottom();
                  }}/>
            </ScrollView>
            );

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
                    leftButton={<BlueBackButton />}
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