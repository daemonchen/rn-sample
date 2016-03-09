'use strict';
var React = require('react-native');
var moment = require('moment');
var {
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    AlertIOS,
    StyleSheet
} = React

// var Swipeout = require('react-native-swipeout');
var taskAction = require('../../actions/task/taskAction');
var taskListAction = require('../../actions/task/taskListAction');
var taskListStore = require('../../stores/task/taskListStore');

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');
var util = require('../../common/util');
var appConstants = require('../../constants/appConstants');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            done: this.props.rowData.status
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    // handleUpdate: function(result){
    //     if (parseInt(result.data) != this.props.rowData.taskId) {
    //         return;
    //     };
    //     var status = (this.state.done == 1) ? 0 : 1
    //     this.setState({
    //         done: status
    //     });
    // },
    onChange: function() {
        var result = taskListStore.getState();
        switch(result.type){
            // case 'update':
            //     return this.handleUpdate(result);
        }
    },
    onPressCircle: function(){
        var status = (this.state.done == 1) ? 0 : 1
        AlertIOS.alert(
            '',
            '您确定要更改任务状态吗',
            [
                {text: '确定', onPress: () => {
                    taskAction.update({
                        taskId: this.props.rowData.taskId,
                        status: status,
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )
    },
    onPressRow: function(){
        this.props.onPressRow(this.props.rowData, this.props.sectionID, this.props.rowID);
    },
    renderCheckIcon: function(){
        var circleImage = (this.state.done == 1) ? require('../../images/task/task_status_done.png') : require('../../images/task/task_status.png')
        return(
            <TouchableWithoutFeedback onPress={this.onPressCircle}>
                <View style={styles.checkIconWrapper}>
                    <Image source={circleImage} style={styles.checkIcon36}/>
                </View>
            </TouchableWithoutFeedback>
            )
    },
    renderTimeLabel: function(timestamp){
        var time = moment(timestamp).format('YYYY-MM-DD');
        return(
            <Text style={[styles.timeLabel, styles.rowTextDetailRight, commonStyle.textGray]}>
                {time}
            </Text>
            );

    },
    render: function(){
        return(
            <TouchableHighlight
            underlayColor='#eee'
            onPress={this.onPressRow}>
                <View style={styles.rowStyle}>
                    {this.renderCheckIcon()}
                    <View style={styles.contentWrapper}>
                        <View style={styles.contentTop}>
                            <Text style={styles.rowText}>{this.props.rowData.taskTitle}</Text>
                        </View>
                        <View style={styles.contentBottom}>
                            <Text style={[styles.rowTextDetail, styles.rowTextDetailLeft, commonStyle.textGray]}
                            numberOfLines={1}>
                                订单：{this.props.rowData.orderTitle}
                            </Text>
                            {this.renderTimeLabel(this.props.rowData.endTime)}
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
            );
    }
});