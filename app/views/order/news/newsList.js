'use strict';
var React = require('react-native')
var TimerMixin = require('react-timer-mixin');
var {
    Text,
    View,
    Image,
    ListView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var newsListAction = require('../../../actions/news/newsListAction');
var newsListStore = require('../../../stores/news/newsListStore');


var styles = require('../../../styles/order/orderDetail');
var commonStyle = require('../../../styles/commonStyle');
var util = require('../../../common/util');
var NewsItem = require('./newsItem');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        var ds = new ListView.DataSource({
            getSectionData: this.getSectionData,
            getRowData: this.getRowData,
            rowHasChanged: (r1, r2) => true,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2}) // assumes immutable objects
            // return {dataSource: ds.cloneWithRows(ArticleStore.all())}
        return {
            hostId: this.props.data.orderId,//订单id
            hostType: 1,//所属者类型,1:针对订单,2:针对任务
            pageNum: 1,
            pageSize: 20,
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentDidMount: function(){
        this.onRefresh();
        this.unlisten = newsListStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    transfromDataBlob: function(response){
        var rawData = response.data
        var dataBlob = {};
        var sectionIDs = [];
        var rowIDs = [];
        for (var i = 0; i <= rawData.length-1; i++) {
            sectionIDs.push(i);
            dataBlob[i] = rawData[i];
            rowIDs[i] = [];
            var subChildren = rawData[i].data;
            for (var j = 0; j <= subChildren.length - 1; j++) {
                var sub = subChildren[j];
                rowIDs[i].push(sub.dynamic.id);

                dataBlob[i + ':' + sub.dynamic.id] = sub;
            };
        };
        // console.log('---sectionIDs', sectionIDs);
        // console.log('---rowIDs', rowIDs);
        this.setState({
            dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            loaded     : true,
            list: rawData || [],
            total: response.total,
            isRefreshing: false
        });
    },
    getSectionData: function(dataBlob, sectionID){
        return dataBlob[sectionID];
    },
    getRowData: function(dataBlob, sectionID, rowID){
        return dataBlob[sectionID + ':' + rowID];
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <NewsItem rowData={rowData} sectionID={sectionID}
            rowID={rowID} />
            )
    },
    renderSectionHeader: function(sectionData, sectionID){
        return(
            <View style={[styles.newsSectionHeder]}>
                <View style={styles.newsTimeline}/>
                <Image
                      style={styles.newsTagGray}
                      source={require('../../../images/order/circle_gray_fill.png')} />
                <Text style={[styles.newsSectionText,commonStyle.blue]}
                numberOfLines={1} >
                    {sectionData.time}
                </Text>
            </View>
            )
    },
    handleGet: function(result, isLoadmore){
        // console.log('-------result', result.status, result.message);
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        this.transfromDataBlob(result);
    },
    onChange: function() {
        var result = newsListStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            case 'loadmore':
                return this.handleGet(result, true)
        }
    },
    onRefresh: function() {
        this.setState({
            pageNum: 1,
            isRefreshing: true
        });
        newsListAction.getList({
            hostType: this.state.hostType,
            hostId: this.state.hostId,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    onInfinite: function() {
        if (!this.loadedAllData()) {
            return;
        };
        this.setState({
            pageNum: this.state.pageNum + 1
        });
        newsListAction.loadMore({
            hostType: this.state.hostType,
            hostId: this.state.hostId,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    loadedAllData: function() {
        return this.state.list.length >= this.state.total||this.state.list.length===0;
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
                <Image source={require('../../../images/empty/no_message_gray.png')} />
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        您还没有动态
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
        // console.log('---this.state.dataSource', this.state.dataSource);
        return (
            <ListView
                ref = {(list) => {this.list= list}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSectionHeader={this.renderSectionHeader}
                scrollEventThrottle={10}
                contentContainerStyle={{paddingBottom: 40}}
                onEndReached={this.onInfinite}
                onEndReachedThreshold={40}
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