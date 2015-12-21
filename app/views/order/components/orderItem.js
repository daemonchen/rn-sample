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
    StyleSheet
} = React

var Swipeout = require('react-native-swipeout');
var util = require('../../../common/util');
var CircleProgressView = require('../../../common/circleProgress')
var styles = require('../../../styles/order/orderItem.js');
var commonStyle = require('../../../styles/commonStyle');
var appConstants = require('../../../constants/appConstants');
var orderItem = React.createClass({
    getInitialState: function(){
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
        if (!this.props.rowData.customerName) {
            return(<View />);
        };
        return(
            <Text style={[styles.orderTextRight, commonStyle.textLight]}>
                客户:{this.props.rowData.customerName}
            </Text>
            )
    },
    renderTimeLabel: function(timestamp){
        var time = moment(timestamp).format('YYYY-MM-DD');
        if (moment().valueOf() > timestamp) {//任务过期
            return(
                <Text style={[styles.orderTextLeft, commonStyle.red]}>
                    {time}
                </Text>
                );
        };
        return(
            <Text style={[styles.orderTextLeft, commonStyle.textLight]}>
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
        var targetRights = 4;
        if ((rights & targetRights) == targetRights){
            return(
                <Swipeout autoClose={true} right={swipeoutBtns}
                backgroundColor='transparent' style={styles.swipeWrapper}>
                    <TouchableHighlight underlayColor='#eee'
                    onPress={this.onPress}>
                        <View style={styles.rowStyle}>
                            <CircleProgressView
                              progress={this.state.progress}
                              lineWidth={2}
                              lineCap={CircleProgressView.LineCapSquare}   // LineCapButt | LineCapRound | LineCapSquare
                              circleRadius={20}
                              circleColor='#34a853'
                              circleUnderlayColor='#e6e6e6'
                              style={styles.circle}/>
                            {this.renderPercent(this.props.rowData.overPercent)}
                            <View style={styles.orderContentWrapper}>
                                <Text style={[styles.orderTitle, commonStyle.textDark]}
                                numberOfLines={1}>
                                    {this.props.rowData.title}
                                </Text>
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
                        <CircleProgressView
                          progress={this.state.progress}
                          lineWidth={2}
                          lineCap={CircleProgressView.LineCapSquare}   // LineCapButt | LineCapRound | LineCapSquare
                          circleRadius={20}
                          circleColor='#34a853'
                          circleUnderlayColor='#e6e6e6'
                          style={styles.circle}/>
                        {this.renderPercent(this.props.rowData.overPercent)}
                        <View style={styles.orderContentWrapper}>
                            <Text style={[styles.orderTitle, commonStyle.textDark]}
                            numberOfLines={1}>
                                {this.props.rowData.title}
                            </Text>
                            <View style={styles.orderContent}>
                                {this.renderTimeLabel(this.props.rowData.endTime)}
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                )
        }
    }
});

module.exports = orderItem