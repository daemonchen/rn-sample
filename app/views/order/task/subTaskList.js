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
    onPressCircle: function(rowData){
        var status = (rowData.status == 1) ? 0 : 1
        AlertIOS.alert(
            '',
            '您确定要更改任务状态吗',
            [
                {text: '确定', onPress: () => {
                    taskListAction.update({
                        id: rowData.id,
                        status: status,
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )
    },
    renderCheckIcon: function(rowData){
        var circleImage = (rowData.status == 1) ? require('../../../images/task/task_status_done.png') : require('../../../images/task/task_status.png')
        return(
            <TouchableWithoutFeedback onPress={()=>{this.onPressCircle(rowData)}}>
                <View style={styles.checkIconWrapper}>
                    <Image source={circleImage} style={styles.checkIcon36}/>
                </View>
            </TouchableWithoutFeedback>
            )
    },
    renderRow: function(data){
        return(
            <TouchableHighlight
            underlayColor='#eee'
            onPress={()=>{this.props.onPressRow(data)}}>
                <View style={styles.rowStyle}>
                    {this.renderCheckIcon(data)}
                    <View style={styles.contentWrapper}>
                        <View style={styles.contentTop}>
                            <Text style={styles.rowText}>{data.jobName}</Text>
                        </View>
                        <View style={styles.contentBottom}>
                            <Text style={[styles.rowTextDetail, styles.rowTextDetailLeft, commonStyle.textGray]}
                            numberOfLines={1}>
                                订单：{data.orderTitle}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
            );
    },
    render: function(){
        return(
            <ListView
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}/>
            );
    }
});