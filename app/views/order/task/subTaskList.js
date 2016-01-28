'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var SearchBar = require('react-native-search-bar');
var {
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    AlertIOS,
    StyleSheet
} = React;

var taskListAction = require('../../../actions/task/taskListAction');

var SubTaskItem = require('./subTaskItem');
var contactsStyle = require('../../../styles/contact/contactsItem');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(this.props.data)
        }
    },
    renderRow: function(data){
        return (
            <SubTaskItem rowData={data}
            onPressRow={this.props.onPressRow} />
            )
    },
    render: function(){
        return(
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}/>
            );
    }
});