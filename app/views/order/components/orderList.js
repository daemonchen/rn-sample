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
var orderStore = require('../../../stores/order/orderStore');
var util = require('../../../common/util');

var commonStyle = require('../../../styles/commonStyle');
var OrderItem = require('./orderItem');

var orderList = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return {
            status: this.props.status,//-1删除，0正常，1结束
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
        if (nextProps.status != this.props.status) {
            this._timeout = this.setTimeout(this.onRefresh, 15)
        };
    },
    componentDidMount: function(){
        this.onRefresh();
        this.unlisten = orderListStore.listen(this.onChange);
        this.unlistenOrderChange = orderStore.listen(this.onOrderChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenOrderChange();
    },
    onOrderChange: function(){
        var result = orderStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            this.setTimeout(this.onRefresh, 350)
            // this.onRefresh();
        };
        if (result.type == 'update') {
            this.setTimeout(this.onRefresh, 350)
            // this.onRefresh();
        };
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
            loaded     : true
        });
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
            case 'delete':
                return this.handleDelete(result);
        }
    },
    onRefresh: function() {
        this.setState({
            pageNum: 1
        });
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
            orderId:rowData.id
        });
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <OrderItem
            rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            onPress={this.props.onPressRow}
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
                contentContainerStyle={{paddingBottom: 40}}
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
    }
});
module.exports = orderList;