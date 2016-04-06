'use strict';

import React, {
    Text,
    View,
    ListView,
    AlertIOS,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TouchableHighlight,
    StyleSheet
} from 'react-native'

var moment = require('moment');


var Swipeout = require('react-native-swipeout');
var util = require('../../../common/util');
// var CircleProgressView = require('../../../common/circleProgress');
var ProgressBar = require('../../../common/progressBar');
var styles = require('../../../styles/order/orderItem.js');
var commonStyle = require('../../../styles/commonStyle');
var appConstants = require('../../../constants/appConstants');

var orderStore = require('../../../stores/order/orderStore');
var orderAction = require('../../../actions/order/orderAction');

var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    getInitialState: function(){
        console.log('-----orderItem data:', this.props.rowData.overPercent)
        return{
            progress: parseInt(this.props.rowData.overPercent)/100 || 0
        }
    },
    onPress: function(){
        this.props.onPress(this.props.rowData, this.props.sectionID);
        // this.setState({
        //     progress: 1
        // });
    },
    onDelete: function(){
        this.props.onDelete(this.props.rowData, this.props.sectionID);
    },
    renderCustomerLabel: function(){
        // console.log('---this.props.rowData', this.props.rowData);
        if (!this.props.rowData.customerName) {
            return(<View />);
        };
        return(
            <Text style={[styles.orderTextRight, commonStyle.textGray]}
            numberOfLines={1}>
                客户：{this.props.rowData.customerName}
            </Text>
            )
    },
    renderTimeLabel: function(timestamp){
        var status = this.props.status;//0:未完成 1:已完成 2:关注
        var time = moment(timestamp).format('YYYY-MM-DD');
        var isDelay = moment().valueOf() > (timestamp + 24 *60 * 60 * 1000);
        if ((status == 0) && isDelay) {//未完成任务过期
            return(
                <Text style={[styles.orderTextLeft, commonStyle.red]}>
                    {time}
                </Text>
                );
        };
        return(
            <Text style={[styles.orderTextLeft, commonStyle.textGray]}>
                {time}
            </Text>
            );
    },
    renderPercent: function(percentString){
        if (!percentString || parseInt(percentString) == 0) {
            percentString = '0'
        };
        return(
            <Text style={[styles.percent]}>{percentString}%</Text>
            );
    },
    renderCheckIcon: function(){
        var circleImage = (this.props.rowData.status == 1) ? require('../../../images/order/task_status_done.png') : require('../../../images/order/task_status_default.png')
        return(
            <TouchableWithoutFeedback onPress={this.onPressCircle}>
                <View style={styles.checkIconWrapper}>
                    <Image source={circleImage} style={styles.checkIcon}/>
                </View>
            </TouchableWithoutFeedback>
            )

    },
    onPressCircle: function(){
        var status = (this.props.rowData.status == 1) ? 0 : 1
        AlertIOS.alert(
            '',
            '您确定要更改订单状态吗',
            [
                {text: '确定', onPress: () => {
                    console.log('----order status', this.props.rowData);
                    orderAction.updateStatus({
                        id: this.props.rowData.orderId,
                        status: status,
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )
    },
    _handleSwipeout: function(){
        this.props._handleSwipeout(this.props.rowData, this.props.sectionID, this.props.rowID);
    },
    renderProgressBar: function(){
        return(
            <ProgressBar
                fillStyle={styles.progressBarFill}
                containerWidth={{width: width - 80}}
                style={styles.progressBar}
                progress={this.state.progress} />
            );
    },
    render: function(){
        var self = this;
        // setTimeout((function() {
        //       self.setState({ progress: self.state.progress + parseInt(self.props.rowData.overPercent)/100});
        //     }), 350);
        var swipeoutBtns = [
          {
            text: '删除',
            type: 'delete',
            onPress: this.onDelete
            // backgroundColor: ''
          }
        ]
        var rights = appConstants.userRights.rights;
        var targetRights = 4;
        var progress = parseInt(this.props.rowData.overPercent)/100 || 0;
        if (this.props.status == 2) {//关注列表
            return(
                <TouchableHighlight underlayColor='#eee'
                onPress={this.onPress}>
                    <View style={styles.rowStyle}>
                        {this.renderCheckIcon()}
                        <View style={styles.orderContentWrapper}>
                            <Text style={[styles.orderTitle, commonStyle.textDark]}
                            numberOfLines={1}>
                                {this.props.rowData.title}
                            </Text>
                            {this.renderProgressBar()}
                            <View style={styles.orderContent}>
                                {this.renderTimeLabel(this.props.rowData.endTime)}
                                {this.renderCustomerLabel()}
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                )
        }else{

            if ((rights & targetRights) == targetRights){
                return(
                    <Swipeout autoClose={true} right={swipeoutBtns}
                    backgroundColor='transparent'
                    scroll={event => this.props._allowScroll(event)}
                    close={!this.props.rowData.active}
                    onOpen={this._handleSwipeout}
                    style={styles.swipeWrapper}>
                        <TouchableHighlight underlayColor='#eee'
                        onPress={this.onPress}>
                            <View style={styles.rowStyle}>
                                {this.renderCheckIcon()}
                                <View style={styles.orderContentWrapper}>
                                    <Text style={[styles.orderTitle, commonStyle.textDark]}
                                    numberOfLines={1}>
                                        {this.props.rowData.title}
                                    </Text>
                                    {this.renderProgressBar()}
                                    <View style={styles.orderContent}>
                                        {this.renderTimeLabel(this.props.rowData.endTime)}
                                        {this.renderCustomerLabel()}
                                    </View>
                                </View>
                            </View>
                        </TouchableHighlight>
                    </Swipeout>
                    )
            }else{
                return(
                    <TouchableHighlight underlayColor='#eee'
                    onPress={this.onPress}>
                        <View style={styles.rowStyle}>
                            {this.renderCheckIcon()}
                            <View style={styles.orderContentWrapper}>
                                <Text style={[styles.orderTitle, commonStyle.textDark]}
                                numberOfLines={1}>
                                    {this.props.rowData.title}
                                </Text>
                                {this.renderProgressBar()}
                                <View style={styles.orderContent}>
                                    {this.renderTimeLabel(this.props.rowData.endTime)}
                                    {this.renderCustomerLabel()}
                                </View>
                            </View>
                        </View>
                    </TouchableHighlight>
                    )
            }
        }
    }
});
