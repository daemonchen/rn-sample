'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
var {
    Text,
    View,
    ListView,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var mockData = require('../../mock/homeList');
var homeList = React.createClass({
    getInitialState: function() {
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
  // reloadArticles() {
  //   return ArticleStore.reload() // returns a Promise of reload completion
  // },
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
    onPressRow: function(rowData, sectionID){
        console.log(rowData);
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <TouchableOpacity onPress={() => this.onPressRow(rowData, sectionID)}>
                <View style={styles.rowStyle}>
                    <Text style={styles.rowText}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>
            )
    },
    renderSectionHeader: function(sectionData, sectionID){
        return(
            <View style={styles.section}>
                <Text style={styles.text}>My custom section header {sectionData.timeLabel}</Text>
            </View>
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
        // return (
        //   <ListView
        //   style={styles.container}
        //   contentContainerStyle={{paddingVertical: 0}}
        //   onScroll={this.onScroll}
        //   dataSource={this.state.dataSource}
        //   renderFooter={this.renderFooter}
        //   renderRow={this.renderRow}
        //   renderSectionHeader={this.renderSectionHeader}
          // onEndReached={this.onEndReached}
          // onEndReachedThreshold={40} />
        // )
        return (
            <RefreshableListView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
                dataSource={this.state.dataSource}
                renderSectionHeader={this.renderSectionHeader}
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 0
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#3F51B5',
        flexDirection: 'column',
        paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    text: {
        color: 'white',
        paddingHorizontal: 8,
        fontSize: 16
    },
    rowStyle: {
        paddingVertical: 20,
        paddingLeft: 16,
        borderTopColor: 'white',
        borderLeftColor: 'white',
        borderRightColor: 'white',
        borderBottomColor: '#E0E0E0',
        borderWidth: 1
    },
    rowText: {
        color: '#212121',
        fontSize: 16
    },
    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        backgroundColor: '#e3e3e3'
    }
});
module.exports = homeList;