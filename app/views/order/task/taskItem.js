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

var taskListAction = require('../../../actions/task/taskListAction');
var taskListStore = require('../../../stores/task/taskListStore');

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var util = require('../../../common/util');
var appConstants = require('../../../constants/appConstants');
/*
target: 表示从哪里打开任务列表 enum
{
    0: 'createOrder',
    1: 'createTask',
    2: 'normal'
}
*/
module.exports = React.createClass({
    getInitialState: function(){
        return{
            done: this.props.rowData.jobDO.status,
            isCheck: this.props.rowData.isCheck,
            target: this.props.target || 2
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    handleUpdate: function(result){
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (parseInt(result.data) != this.props.rowData.jobDO.id) {
            return;
        };
        var status = (this.state.done == 1) ? 0 : 1
        this.setState({
            done: status
        });
    },
    onChange: function() {
        var result = taskListStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'update':
                return this.handleUpdate(result);
        }
    },
    onPressCircle: function(){
        var status = (this.state.done == 1) ? 0 : 1
        var isCheck = (this.state.isCheck == 1) ? 0 : 1;
        if (this.props.target == 1) {//新建任务的时候，选择任务依赖
            taskListAction.addDependinces({
                type: 'addDependinces',
                id: this.props.rowData.jobDO.id,
                isCheck: isCheck
            });
            this.setState({
                isCheck: isCheck
            });
        }else{
            AlertIOS.alert(
                '',
                '您确定要更改任务状态吗',
                [
                    {text: '确定', onPress: () => {
                        taskListAction.update({
                            id: this.props.rowData.jobDO.id,
                            status: status,
                        });
                    } },
                    {text: '取消', onPress: () => {return}, style: 'cancel'},
                ]
            )
        }
    },
    onPressRow: function(){
        this.props.onPressRow(this.props.rowData, this.props.sectionID);
    },
    onDelete: function(){
        taskListAction.delete({
            jobId: this.props.rowData.jobDO.id
        });
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
            <Text style={[styles.rowText, commonStyle.textGray]}>
                {time}
            </Text>
            );
    },
    renderTimeLine: function(){
        if (this.props.target == 1) {
            return(<View />);
            //如果是新建任务的时候，不需要timeline
        };
        if(this.state.done == 0){
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
        if (this.props.target == 1) {
            var circleImage = (this.state.isCheck == 1) ? require('../../../images/task/task_status_done.png') : require('../../../images/task/task_status.png')
        }else{
            var circleImage = (this.state.done == 1) ? require('../../../images/task/task_status_done.png') : require('../../../images/task/task_status.png')
        }
        return(
            <TouchableWithoutFeedback onPress={this.onPressCircle}
            style={styles.checkIcon} >
                <View style={styles.checkIconWrapper}>
                    <Image source={circleImage} />
                </View>
            </TouchableWithoutFeedback>
            )
    },
    render: function(){
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
                <Swipeout autoClose={true} right={swipeoutBtns} backgroundColor='transparent' style={styles.swipeWrapper}>
                    <TouchableHighlight
                    underlayColor='#eee'
                    onPress={this.onPressRow}>
                        <View style={styles.rowStyle}>
                            {this.renderTimeLine()}
                            {this.renderCheckIcon()}
                            <View style={styles.contentWrapper}>
                                <Text style={[styles.rowText,styles.rowTitle]}
                                numberOfLines={1}>
                                    {this.props.rowData.jobDO.jobName}
                                </Text>
                                {this.renderTimeLabel(this.props.rowData.jobDO.endTime)}
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
                            <Text style={[styles.rowText,styles.rowTitle]}
                            numberOfLines={1}>
                                {this.props.rowData.jobDO.jobName}
                            </Text>
                            {this.renderTimeLabel(this.props.rowData.jobDO.endTime)}
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