'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
import NavigationBar from 'react-native-navbar'
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

var _navigator, _topNavigator = null;

var attachListStore = require('../../../stores/attach/attachListStore');
var attachListAction = require('../../../actions/attach/attachListAction');
var attachStore = require('../../../stores/attach/attachStore');

var commonStyle = require('../../../styles/commonStyle');

var AttachItem = require('./attachItem');
var Button = require('../../../common/button.js');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}) // assumes immutable objects
        return {
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentDidMount: function() {
        this.unlistenAttach = attachStore.listen(this.onAttachChange);
        this.unlisten = attachListStore.listen(this.onChange)
        this.fetchData();
    },
    componentWillUnmount: function(){
        this.unlisten();
        this.unlistenAttach()
    },
    onAttachChange: function(){
        var result = attachStore.getState();
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        if (result.type == 'create') {
            this.setTimeout(this.fetchData, 350);
        };
        if (result.type == 'get') {
            this.setTimeout(this.fetchData, 350);
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
        });
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
            loaded: true
        });
        return;
    },
    onChange: function(){
        var result = attachListStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            case 'delete':
                return this.handleDelete(result)
        }
    },
    fetchData: function(){
        attachListAction.getList({
            hostId: this.props.data.id,
            hostType: this.props.hostType
        });
    },
    renderRow: function(rowData, sectionID, rowID) {
        return (
            <AttachItem
            rowData={rowData}
            sectionID={sectionID}
            rowID={rowID}
            onPress={this.props.onPressRow} />
            )
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
            <ListView
              style={commonStyle.container}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow} />
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