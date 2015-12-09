'use strict';
var React = require('react-native')
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var TimerMixin = require('react-timer-mixin');
var {
    Text,
    View,
    ListView,
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
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2}) // assumes immutable objects
            // return {dataSource: ds.cloneWithRows(ArticleStore.all())}
        return {
            hostId: this.props.data.id,//订单id
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
                rowIDs[i].push(j);

                dataBlob[i + ':' + j] = sub;
            };
        };
        this.setState({
            dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            loaded     : true,
            list: rawData || [],
            total: response.total
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
                <View style={styles.newsTagGray}/>
                <Text style={[styles.newsSectionText,commonStyle.blue]}
                numberOfLines={1} >
                    {sectionData.time}
                </Text>
            </View>
            )
    },
    handleGet: function(result, isLoadmore){
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        this.transfromDataBlob(result);
        !isLoadmore && this.list.hideHeader();
        !!isLoadmore && this.list.hideFooter();
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
            pageNum: 1
        });
        newsListAction.getList({
            hostType: this.state.hostType,
            hostId: this.state.hostId,
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize
        });
    },
    onInfinite: function() {
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
    renderListView: function(){
        return (
            <RefreshInfiniteListView
                ref = {(list) => {this.list= list}}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderSectionHeader={this.renderSectionHeader}
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