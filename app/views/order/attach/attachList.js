'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
var RefreshableListView = require('react-native-refreshable-listview')
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicatorIOS,
    ActionSheetIOS,
    StyleSheet
} = React;

var mockData = require('../../../mock/homeList');
var _navigator, _topNavigator = null;

var commonStyle = require('../../../styles/commonStyle');

var AttachItem = require('./attachItem');
var Button = require('../../../common/button.js');

module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({
            getSectionData: this.getSectionData,
            getRowData: this.getRowData,
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2}) // assumes immutable objects
            // return {dataSource: ds.cloneWithRows(ArticleStore.all())}
        return {
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentDidMount: function() {
        this.fetchData();
    },
    fetchData: function(){
        var dataBlob = {};
        var sectionIDs = [];
        var rowIDs = [];
        for (var i = 0; i <= mockData.length-1; i++) {
            sectionIDs.push(i);
            dataBlob[i] = mockData[i];
            rowIDs[i] = [];
            var subChildren = mockData[i].subList;
            for (var j = 0; j <= subChildren.length - 1; j++) {
                var sub = subChildren[j];
                rowIDs[i].push(sub.name);

                dataBlob[i + ':' + sub.name] = sub;
            };
        };
        this.setState({
            dataSource : this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
            loaded     : true
        });
    },
    getSectionData: function(dataBlob, sectionID){
        return dataBlob[sectionID];
    },
    getRowData: function(dataBlob, sectionID, rowID){
        return dataBlob[sectionID + ':' + rowID];
    },
    // onPressRow: function(rowData, sectionID){
    //     console.log(rowData);
    // },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <AttachItem
            rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            onPress={this.props.onPressRow} />
            )
    },
    onEndReached: function(){
        console.log('onEndReached')
    },
    onScroll: function(){
        console.log('onScroll');
    },
    render: function() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if(this.state.list.length == 0){
            return this.renderEmptyView();
        }
        return this.renderListView();
    },
    renderListView: function(){
        return (
            <RefreshableListView
                style={commonStyle.container}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                onEndReached={this.fetchData}
                onEndReachedThreshold={40}
                loadData={this.fetchData}
                refreshDescription="reload" />
            )
    },
    renderEmptyView: function(){
        return(
            <View style={styles.empty}>
                <Text style={[commonStyle.textLight, commonStyle.textInput, commonStyle.alignCenter]}>目前没有附件</Text>
                <Button
                style={commonStyle.blueButton}
                onPress={this.props.onEmptyButtonPress} >
                    添加附件
                </Button>
            </View>
            );
    },
    renderLoadingView: function(){
        return (
            <View style={commonStyle.container}>
                <ActivityIndicatorIOS
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large" />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    main:{
        flex:1
    },
    empty:{
        justifyContent: 'center',
        alignItems: 'center'
    }
});