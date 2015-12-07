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
    Navigator,
    ScrollView,
    TouchableHighlight,
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

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentDidMount: function(){
        this.unlisten = templateListStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
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
            backgroundColor='transparent' >
                <TouchableHighlight underlayColor='#eee'
                onPress={() => this.props.onPressRow(rowData)} >
                    <View style={styles.templateItem}>
                        <Text style={commonStyle.paddingHorizontal}>
                            {rowData.templateName}
                        </Text>
                    </View>
                </TouchableHighlight>
            </Swipeout>
            );
    },
    render: function(){
        return(
            <ScrollView style={commonStyle.container}
            automaticallyAdjustContentInsets={false} >
                <ListView
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow} />
            </ScrollView>
            );
    }
});

var styles = StyleSheet.create({
    templateItem: {
        paddingVertical: 16
    }
});