'use strict';
var React = require('react-native')
var TimerMixin = require('react-timer-mixin');
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var {
    Text,
    View,
    ListView,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var orderListAction = require('../../../actions/order/orderListAction');
var orderListStore = require('../../../stores/order/orderListStore');
var util = require('../../../common/util');

var styles = require('../../../styles/home/style.js');
var OrderItem = require('./orderItem');

var orderList = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return {
            status: 0,//-1删除，0正常，1结束
            pageNum: 1,
            pageSize: 20,
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            status: nextProps.status
        });
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.onRefresh, 15)
    },
    componentDidMount: function(){
        this.onRefresh();
        this.unlisten = orderListStore.listen(this.onChange)
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
        var result = orderListStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            // case 'delete':
            //     return this.handleDelete(result);
        }
    },
    onRefresh: function() {
        this.setState({
            pageNum: 1
        });
        console.log('this.state.status:',this.state.status);
        orderListAction.getList({
            status: this.state.status,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    onInfinite: function() {
        this.setState({
            pageNum: this.state.pageNum + 1
        });
        orderListAction.loadMore({
            status: this.state.status,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    loadedAllData: function() {
        return this.state.list.length >= this.state.total||this.state.list.length===0;
    },
    onDelete: function(rowData){
        orderListAction.delete({
            msgId:rowData.msgId
        });
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <OrderItem
            rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            onPress={this.props.events.onPressRow}
            onDelete={this.onDelete} />
            )
    },
    render: function() {
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
                style={styles.container}
                onRefresh = {this.onRefresh}
                onInfinite = {this.onInfinite}
                loadedAllData={this.loadedAllData}
                >
            </RefreshInfiniteListView>
            )
    },
    renderLoadingView: function(){
        return (
            <View style={styles.header}>
                <Text style={styles.headerText}>User List</Text>
                <View style={styles.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[styles.activityIndicator, {height: 80}]}
                        size="large" />
                </View>
            </View>
        );
    }
});
module.exports = orderList;