'use strict';
var React = require('react-native')
var SearchBar = require('react-native-search-bar');
var Swipeout = require('react-native-swipeout');
var TimerMixin = require('react-timer-mixin');
var {
    Text,
    View,
    ListView,
    Image,
    ScrollView,
    TouchableHighlight,
    ActivityIndicatorIOS,
    StyleSheet
} = React
/*
target: 表示从哪里打开订单模版 enum
{
    1: 'createOrder',
    2: 'normal'
}
*/
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var util = require('../../../common/util');

var templateListAction = require('../../../actions/template/templateListAction');
var templateListStore = require('../../../stores/template/templateListStore');
var templateStore = require('../../../stores/template/templateStore');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({
            // rowHasChanged: (r1, r2) => r1 !== r2
            rowHasChanged: (r1, r2) => true////为了在swipe的时候刷新列表
        });
        return {
            loaded : false,
            list: [],
            dataSource: ds,
            scrollEnabled: true
        }
    },
    componentDidMount: function(){
        this.unlistenTemplate = templateStore.listen(this.onTemplateChange);
        this.unlisten = templateListStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenTemplate();
    },
    _allowScroll: function(scrollEnabled) {
       this.setState({ scrollEnabled: scrollEnabled })
    },
    _handleSwipeout: function(rowData){
        var rawData = this.state.list;
        for (var i = 0; i < rawData.length; i++) {
            if (rowData.id != rawData[i].id) {
                rawData[i].active = false
            }else{
                rawData[i].active = true
            }
        }

        this.setState({
            dataSource : this.state.dataSource.cloneWithRows(rawData || [])
        });
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
    },
    handleUpdate: function(result){
        if (result.status != 200 && !!result.message) {
            return;
        }
        this.setTimeout(this.fetchData, 350);
        return;
    },
    handleDelete: function(result){
        if (result.status != 200 && !!result.message) {
            return;
        }
        this.setTimeout(this.fetchData, 350);
    },
    onChange: function() {
        var result = templateListStore.getState();
        console.log('------templatelist', result);
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            case 'delete':
                return this.handleDelete(result);
            default:
                return;
        }
    },
    onTemplateChange: function(){
        var result = templateStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'update':
                return this.handleUpdate(result);
            default:
                return;
        }
    },
    fetchData: function() {
        templateListAction.getList();
    },
    onDelete: function(data){
        templateListAction.delete({
            id: data.id
        });
    },
    renderRow: function(rowData){
        var swipeoutBtns = [
          {
            text: '删除',
            type: 'delete',
            onPress: ()=>{
                this.onDelete(rowData)
            }
            // backgroundColor: ''
          }
        ]
        return(
            <Swipeout autoClose={true}
            right={swipeoutBtns}
            scroll={event => this._allowScroll(event)}
            close={!rowData.active}
            onOpen={()=>{this._handleSwipeout(rowData)}}
            backgroundColor='transparent' >
                <TouchableHighlight underlayColor='#eee'
                onPress={() => this.props.onPressRow(rowData)} >
                    <View style={styles.templateItem}>
                        <Text style={[commonStyle.paddingHorizontal, commonStyle.commonTitle]}>
                            {rowData.templateName}
                        </Text>
                    </View>
                </TouchableHighlight>
            </Swipeout>
            );
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Image source={require('../../../images/empty/no_template_gray.png')} />
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#bdbdbd'}}>
                        您还没有模版
                </Text>
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
                        style={[commonStyle.activityIndicator]}
                        size="small" />
                </View>
            </View>
        );
    },
    render: function(){
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.list || this.state.list.length == 0) {
            return this.renderEmptyRow();
        };
        return(
            <ListView
                style={commonStyle.container}
                dataSource={this.state.dataSource}
                scrollEnabled={this.state.scrollEnabled}
                renderRow={this.renderRow} />
            );
    }
});

var styles = StyleSheet.create({
    templateItem: {
        paddingVertical: 16
    }
});