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

var commentListAction = require('../../../actions/comment/commentListAction');
var commentListStore = require('../../../stores/comment/commentListStore');
var commentStore = require('../../../stores/comment/commentStore');
var util = require('../../../common/util');

var styles = require('../../../styles/order/comment.js');
var commonStyle = require('../../../styles/commonStyle');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
        return {
            jobId: this.props.data,//任务id
            pageNum: 1,
            pageSize: 20,
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentDidMount: function(){
        this.unlisten = commentListStore.listen(this.onChange);
        this.unlistenComment = commentStore.listen(this.onChangeComment);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.onRefresh, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenComment();
    },
    onChangeComment: function(){//TODO: change to comment create listener
        var result = commentStore.getState();
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
        var result = commentListStore.getState();
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
        commentListAction.getList({
            jobId: this.state.jobId,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    onInfinite: function() {
        this.setState({
            pageNum: this.state.pageNum + 1
        });
        commentListAction.loadMore({
            jobId: this.state.jobId,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    loadedAllData: function() {
        return this.state.list.length >= this.state.total||this.state.list.length===0;
    },
    onDelete: function(rowData){
        commentListAction.delete({
            orderId:rowData.id
        });
    },
    renderAvatar: function(data){
        if (data.avatar) {
            return(
                <Image
                  style={styles.avatar}
                  source={{uri: data.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: data.bgColor
            }
            return(
                <View style={[styles.avatar, circleBackground]}>
                    <Text style={styles.subName}>{data.simpleUserName}</Text>
                </View>
                )
        }
    },
    renderTimeLabel: function(timestamp){
        var time = util.formatTimestamp(timestamp);
        return(
            <Text style={[styles.time, commonStyle.textLight]}>
                {time}
            </Text>
            )
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <View style={styles.rowStyle}>
                {this.renderAvatar(rowData)}
                <View style={styles.detailWrapper}>
                    <View style={styles.nameWrapper}>
                        <Text style={[styles.name, commonStyle.blue]}>
                        {rowData.userName}
                        </Text>
                        {this.renderTimeLabel(rowData.gmtCreate)}
                    </View>
                    <Text style={[styles.detail, commonStyle.textDark]}>
                        {rowData.comment}
                    </Text>
                </View>
            </View>
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
            <View style={styles.main}>
                <Text style={styles.commentTitle}>
                    评论({this.state.list.length})
                </Text>
                <RefreshInfiniteListView
                    ref = {(list) => {this.list= list}}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow}
                    scrollEventThrottle={10}
                    onRefresh = {this.onRefresh}
                    onInfinite = {this.onInfinite}
                    loadedAllData={this.loadedAllData}
                    contentContainerStyle={{paddingBottom: 40}}
                    >
                </RefreshInfiniteListView>
            </View>
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