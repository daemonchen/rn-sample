'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var commonStyle = require('../../../styles/commonStyle');

var mockData = require('../../../mock/homeList');

var styles = require('../../../styles/home/style.js');
var TaskItem = require('./taskItem');

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
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <TaskItem
            rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            onPressRow={this.props.events.onPressRow}
            onPressCircle={this.props.events.onPressCircle}/>
            )
    },
    renderSectionHeader: function(sectionData, sectionID){
        return(
            <View style={styles.section}>
                <Text style={styles.text}>{sectionData.timeLabel}</Text>
            </View>
            )
    },
    renderSeparator: function(sectionID, rowID, adjacentRowHighlighted){
        return(
            <View style={styles.sepLine}></View>
            )
    },
    renderFooter: function(){
        return (
          <View>
            <ActivityIndicatorIOS
                animating={true}
                size={'large'} />
            <Text>My custom footer</Text>
          </View>
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
        return this.renderListView();
    },
    renderListView: function(){
        return (
            <RefreshableListView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderFooter={this.renderFooter}
                onEndReached={this.fetchData}
                onEndReachedThreshold={40}
                loadData={this.fetchData}
                refreshDescription="reload" />
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

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});