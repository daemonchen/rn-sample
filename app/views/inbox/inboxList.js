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

var commonStyle = require('../../styles/commonStyle');
var InboxItem = require('./inboxItem');
var _navigator, _topNavigator = null;

var mockData = require('../../mock/homeList');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });

        return {
            loaded : false,
            dataSource: ds
        }
    },
    componentDidMount: function() {
        this.fetchData();
    },
    fetchData: function(){
        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(mockData),
            loaded     : true
        });
    },
    onPressRow: function(rowData, sectionID){
        console.log(rowData);
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <InboxItem rowData={rowData} sectionID={sectionID}
            rowID={rowID}
            onPress={this.onPressRow}></InboxItem>
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
    renderInbox: function() {
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
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '消息', }} />
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