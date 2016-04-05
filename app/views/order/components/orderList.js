'use strict';

import React, {
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicatorIOS,
    AlertIOS,
    StyleSheet
} from 'react-native'

var TimerMixin = require('react-timer-mixin');

var orderStore = require('../../../stores/order/orderStore');
var orderAction = require('../../../actions/order/orderAction');
var orderListAction = require('../../../actions/order/orderListAction');
var orderListStore = require('../../../stores/order/orderListStore');
var followOrderAction = require('../../../actions/followOrder/followOrderAction');
var followOrderStore = require('../../../stores/followOrder/followOrderStore');
var orderStore = require('../../../stores/order/orderStore');
var util = require('../../../common/util');

var commonStyle = require('../../../styles/commonStyle');
var OrderItem = require('./orderItem');

var orderList = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        var ds = new ListView.DataSource({
            // rowHasChanged: (r1, r2) => r1 !== r2
            rowHasChanged: (r1, r2) => true////为了在swipe的时候刷新列表
        });
        return {
            status: this.props.status,//0: 进行中 1: 已完成 2: 已关注
            pageNum: 1,
            pageSize: 20,
            loaded : false,
            list: [],
            dataSource: ds,
            scrollEnabled: true
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            status: nextProps.status
        });
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        if (nextProps.status != this.props.status) {
            this._timeout = this.setTimeout(this.onRefresh, 15)
        };
    },
    componentDidMount: function(){
        this.onRefresh();
        this.unlisten = orderListStore.listen(this.onChange);
        this.unlistenOrderChange = orderStore.listen(this.onOrderChange);
        this.unlistenFollowChange = followOrderStore.listen(this.onFollowChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenOrderChange();
        this.unlistenFollowChange();
    },
    _allowScroll: function(scrollEnabled) {
       this.setState({ scrollEnabled: scrollEnabled })
    },
    _handleSwipeout: function(rowData, sectionID, rowID){
        var rawData = this.state.list;
        for (var i = 0; i < rawData.length; i++) {
            if (rowData.orderId != rawData[i].orderId) {
                rawData[i].active = false
            }else{
                rawData[i].active = true
            }
        }

        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(rawData || [])
        });
    },
    onOrderChange: function(){
        var result = orderStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            if (this._timeout) {
                this.clearTimeout(this._timeout)
            };
            this._timeout = this.setTimeout(this.onRefresh, 350)

        };
        if (result.type == 'update') {
            if (this._timeout) {
                this.clearTimeout(this._timeout)
            };
            this._timeout = this.setTimeout(this.onRefresh, 350)
        };
    },
    handleFollowListGet: function(result){

    },
    handleGet: function(result){
        // console.log('------order list result', result);
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        // this.setState({isRefreshing: false});
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(result.data || []),
            list: result.data || [],
            loaded     : true,
            total: result.total,
            isRefreshing: false
        });
        // this.list.hideHeader();
        // this.list.hideFooter();
    },
    handleUpdate: function(result){
        return;
    },
    handleDelete: function(result){
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
        this.setTimeout(this.onRefresh, 350);
        return;
    },
    onFollowChange: function(){
        var result = followOrderStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'get':
                // return this.handleFollowListGet(result);
                return this.handleGet(result);
        }
    },
    onChange: function() {
        var result = orderListStore.getState();

        switch(result.type){
            case 'get':
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
        if (this.state.status == 2) {//获取关注列表
            followOrderAction.get({
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
        }else{
            orderListAction.getList({
                status: this.state.status,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
        }
    },
    onInfinite: function() {
        if (!!this.loadedAllData()) {
            return;
        };
        this.setState({
            pageNum: this.state.pageNum + 1
        });
        if (this.state.status == 2) {
            followOrderAction.loadMore({
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
        }else{
            orderListAction.loadMore({
                status: this.state.status,
                pageNum: this.state.pageNum,
                pageSize: this.state.pageSize
            });
        }
    },
    loadedAllData: function() {
        return this.state.list.length >= this.state.total||this.state.list.length===0;
    },
    onDelete: function(rowData){
        console.log('----rowData', rowData);
        AlertIOS.alert(
            '删除订单',
            '删除订单将连同该订单任务一起删除，确定删除吗？',
            [
                {text: '确定', onPress: () => {
                    orderListAction.delete({
                        orderId:rowData.orderId
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )

    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <View>
                <OrderItem
                status={this.state.status}
                rowData={rowData}
                sectionID={sectionID}
                rowID={rowID}
                onPress={this.props.onPressRow}
                _allowScroll={this._allowScroll}
                _handleSwipeout={this._handleSwipeout}
                onDelete={this.onDelete} />
            </View>
            )
    },
    render: function() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return this.renderListView();
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Image source={require('../../../images/empty/no_order_gray.png')} />
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#bdbdbd'}}>
                        您还没有订单
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
                // scrollEnabled={this.state.scrollEnabled}
        return (
            <ListView
                ref = {(list) => {this.list= list}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                scrollEventThrottle={10}
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
    }
});
module.exports = orderList;