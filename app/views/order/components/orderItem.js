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

var Swipeout = require('react-native-swipeout');

var CircleProgressView = require('../../../common/circleProgress')
var styles = require('../../../styles/order/orderItem.js');
var orderItem = React.createClass({
    getInitialState: function(){
        return{
            progress: 0.4
        }
    },
    onPress: function(){
        this.props.onPress(this.props.rowData, this.props.sectionID);
        this.setState({
            progress: 1
        });
    },
    onDelete: function(){
        console.log('delete stuff');
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
            <Swipeout autoClose={true} right={swipeoutBtns} backgroundColor='transparent' style={styles.swipeWrapper}>
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
                        <Text style={[styles.percent]}>80%</Text>
                        <Text style={styles.rowText}>{this.props.rowData.name}</Text>
                    </View>
                </TouchableHighlight>
            </Swipeout>
            )
    }
});

module.exports = orderItem