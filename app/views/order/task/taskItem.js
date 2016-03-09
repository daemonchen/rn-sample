'use strict';
var React = require('react-native');
var moment = require('moment');
var {
    Text,
    View,
    ListView,
    Image,
    AlertIOS,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    StyleSheet
} = React

var Swipeout = require('react-native-swipeout');

var taskAction = require('../../../actions/task/taskAction');
var taskListAction = require('../../../actions/task/taskListAction');
var taskListStore = require('../../../stores/task/taskListStore');

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var util = require('../../../common/util');
var appConstants = require('../../../constants/appConstants');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            done: this.props.rowData.taskVO.status,
            isCheck: this.props.rowData.isCheck
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },

    onChange: function() {
        var result = taskListStore.getState();
        // if (result.status != 200 && !!result.message) {
        //     return;
        // }
        // switch(result.type){
        //     case 'update':
        //         return this.handleUpdate(result);
        // }
    },
    onPressCircle: function(){
        var status = (this.props.rowData.taskVO.status == 1) ? 0 : 1
        var isCheck = (this.state.isCheck == 1) ? 0 : 1;
        AlertIOS.alert(
            '',
            '您确定要更改任务状态吗',
            [
                {text: '确定', onPress: () => {
                    taskAction.update({
                        taskId: this.props.rowData.taskVO.taskId,
                        status: status,
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )
    },
    onPressRow: function(){
        !!this.props.onPressRow && this.props.onPressRow(this.props.rowData, this.props.sectionID);
    },
    onDelete: function(){
        AlertIOS.alert(
            '删除任务',
            '确定删除该任务吗？',
            [
                {text: '确定', onPress: () => {
                    taskListAction.delete({
                        jobId: this.props.rowData.taskVO.taskId
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )

    },
    renderAvatar: function(user){
        if (!user) {
            return(<View style={styles.taskItemCircle}/>);
        };
        if (user.avatar) {
            return(
                <Image
                  style={styles.taskItemCircle}
                  source={{uri: user.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: user.bgColor
            }
            return(
                <View style={[styles.taskItemCircle, circleBackground]}>
                    <Text style={styles.taskItemTitle}>
                        {user.simpleUserName}
                    </Text>
                </View>
                )
        }
    },
    renderTimeLabel: function(timestamp){
        var time = moment(timestamp).format('YYYY-MM-DD');
        return(
            <Text style={[styles.timeLabel, commonStyle.textGray]}>
                {time}
            </Text>
            );
    },
    renderTimeLine: function(){
        if(this.props.rowData.taskVO.status == 0){
            return(
                <View style={styles.timelineWrapper}>
                    <View style={[styles.timeline]}></View>
                    <View style={[styles.timeline]}></View>
                </View>
                )
        }else{
            return(
                <View style={styles.timelineWrapper}>
                    <View style={[styles.timeline, styles.timelineDone]}></View>
                    <View style={[styles.timeline, styles.timelineDone]}></View>
                </View>
                )
        }
    },
    renderCheckIcon: function(){
        var circleImage = (this.props.rowData.taskVO.status == 1) ? require('../../../images/order/task_status_done.png') : require('../../../images/order/task_status_default.png')
        return(
            <TouchableWithoutFeedback onPress={this.onPressCircle}>
                <View style={styles.checkIconWrapper}>
                    <Image source={circleImage} style={styles.checkIcon}/>
                </View>
            </TouchableWithoutFeedback>
            )

    },
    _handleSwipeout: function(){
        this.props._handleSwipeout(this.props.rowData, this.props.sectionID, this.props.rowID);
    },
    render: function(){
        if (!this.props.rowData) {return(<View />);};
        var swipeoutBtns = [
          {
            text: '删除',
            type: 'delete',
            onPress: this.onDelete
            // backgroundColor: ''
          }
        ]
        var rights = appConstants.userRights.rights;
        var targetRights = 1024;
        if ((rights & targetRights) == targetRights){
            return(
                <Swipeout autoClose={true} right={swipeoutBtns}
                backgroundColor='transparent'
                scroll={event => this.props._allowScroll(event)}
                close={!this.props.rowData.active}
                onOpen={this._handleSwipeout}
                style={styles.swipeWrapper}>
                    <TouchableHighlight
                    underlayColor='#eee'
                    onPress={this.onPressRow}>
                        <View style={styles.rowStyle}>
                            {this.renderTimeLine()}
                            {this.renderCheckIcon()}
                            <View style={styles.contentWrapper}>
                                <View style={styles.contentTop}>
                                    <Text style={[styles.rowText]}
                                    numberOfLines={1}>
                                        {this.props.rowData.taskVO.taskTitle}
                                    </Text>
                                </View>
                                <View style={styles.contentBottom}>
                                    {this.renderTimeLabel(this.props.rowData.taskVO.endTime)}
                                </View>
                            </View>
                            {this.renderAvatar(this.props.rowData.userVO)}
                        </View>
                    </TouchableHighlight>
                </Swipeout>
                )
        }else{
            return(
                <TouchableHighlight
                underlayColor='#eee'
                onPress={this.onPressRow}>
                    <View style={styles.rowStyle}>
                        {this.renderTimeLine()}
                        {this.renderCheckIcon()}
                        <View style={styles.contentWrapper}>
                            <View style={styles.contentTop}>
                                <Text style={[styles.rowText]}
                                numberOfLines={1}>
                                    {this.props.rowData.taskVO.taskTitle}
                                </Text>
                            </View>
                            <View style={styles.contentBottom}>
                                {this.renderTimeLabel(this.props.rowData.taskVO.endTime)}
                            </View>
                        </View>
                        {this.renderAvatar(this.props.rowData.userVO)}
                    </View>
                </TouchableHighlight>
                )
        }
        // return (
        //     <TouchableOpacity onPress={this.onPress}>
        //         <View style={styles.rowStyle}>
        //             <View style={[styles.circle, circleDone]} />
        //             <Text style={styles.rowText}>{this.props.rowData.name}</Text>
        //         </View>
        //     </TouchableOpacity>
        //     )
    }
});