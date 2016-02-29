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
target:
{
    1: 'createTask',check icon是用来选择任务依赖
    2: 'taskdetail',从任务详情的前置任务进入,check icon是用来显示任务完成状态
    3: 'normal'订单详情里展示任务列表，check icon是用来显示和修改任务状态，默认情况下都是这种情况
}
*/
module.exports = React.createClass({
    getInitialState: function(){
        return{
            done: this.props.rowData.jobDO.status,
            isCheck: this.props.rowData.isCheck,
            target: this.props.target || 3
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
        if (this.state.target == 1) {//新建任务的时候，选择任务依赖
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
        if (this.state.target == 1) {
            this.onPressCircle();
        };
        if (this.state.target == 2) {return;};
        if (this.state.target == 3) {
            !!this.props.onPressRow && this.props.onPressRow(this.props.rowData, this.props.sectionID);
        };
    },
    onDelete: function(){
        AlertIOS.alert(
            '删除任务',
            '确定删除该任务吗？',
            [
                {text: '确定', onPress: () => {
                    taskListAction.delete({
                        jobId: this.props.rowData.jobDO.id
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
        if (this.state.target == 1) {
            return(<View />);
            //如果是新建任务的时候，不需要timeline
        };
        if (this.state.target == 2) {
            return(<View />);
            //如果是查看任务依赖列表，不需要timeline
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
        if (this.state.target == 1) {//新建修改任务时候设置任务依赖
            var circleImage = (this.state.isCheck == 1) ? require('../../../images/task/Check_box_selected.png') : require('../../../images/task/Check_box.png');
            return(
            <TouchableWithoutFeedback onPress={this.onPressCircle}>
                <View style={styles.checkIconWrapper}>
                    <Image source={circleImage} style={styles.checkIcon24}/>
                </View>
            </TouchableWithoutFeedback>
            )
        }
        if (this.state.target == 2) {//察看前置任务
            var circleImage = (this.state.done == 1) ? require('../../../images/order/task_status_done.png') : require('../../../images/order/task_status_default.png')
            return(
                <View style={styles.checkIconWrapper}>
                    <Image source={circleImage} style={styles.checkIcon}/>
                </View>
                );
        };
        if (this.state.target == 3) {//查看任务列表
            var circleImage = (this.state.done == 1) ? require('../../../images/order/task_status_done.png') : require('../../../images/order/task_status_default.png')
            return(
                <TouchableWithoutFeedback onPress={this.onPressCircle}>
                    <View style={styles.checkIconWrapper}>
                        <Image source={circleImage} style={styles.checkIcon}/>
                    </View>
                </TouchableWithoutFeedback>
                )
        }
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
        if (this.state.target == 2) {//如果是察看前置任务，不需要有删除操作
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
                                    {this.props.rowData.jobDO.jobName}
                                </Text>
                            </View>
                            <View style={styles.contentBottom}>
                                {this.renderTimeLabel(this.props.rowData.jobDO.endTime)}
                            </View>
                        </View>
                        {this.renderAvatar(this.props.rowData.userVO)}
                    </View>
                </TouchableHighlight>
                )
        }
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
                                        {this.props.rowData.jobDO.jobName}
                                    </Text>
                                </View>
                                <View style={styles.contentBottom}>
                                    {this.renderTimeLabel(this.props.rowData.jobDO.endTime)}
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
                                    {this.props.rowData.jobDO.jobName}
                                </Text>
                            </View>
                            <View style={styles.contentBottom}>
                                {this.renderTimeLabel(this.props.rowData.jobDO.endTime)}
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