'use strict';
var React = require('react-native')
var {
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet
} = React
// { id: 10,
//   title: '萨摩耶是什么',
//   creatorName: '王磊',
//   creatorId: 7,
//   salesManId: 0,
//   startTime: null,
//   endTime: 1448949194000,
//   overTime: null,
//   customerName: '萨摩耶',
//   description: '谁家的萨摩耶',
//   lable: 0,
//   accessoryNum: 0,
//   status: 0,
//   gmtCreate: 1448949364000,
//   gmtModified: 1448949364000,
//   jobList: [],
//   acList: [],
//   factoryId: 0,
//   jobNum: 0,
//   overNum: 0,
//   accessoryIds: null,
//   overPercent: '' }
var Swipeout = require('react-native-swipeout');
var util = require('../../../common/util');
var CircleProgressView = require('../../../common/circleProgress')
var styles = require('../../../styles/order/orderItem.js');
var commonStyle = require('../../../styles/commonStyle')
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
    renderTimeLabel: function(timestamp){
        var time = util.formatTimestamp(timestamp);
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
                            <Text style={[styles.orderTitle, commonStyle.textDark]}>
                                {this.props.rowData.title}
                            </Text>
                            <View style={styles.orderContent}>
                                {this.renderTimeLabel(this.props.rowData.gmtCreate)}
                                <Text style={[styles.orderTextRight, commonStyle.textLight]}>
                                    客户:{this.props.rowData.customerName}
                                </Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeout>
            )
    }
});

module.exports = orderItem