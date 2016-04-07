'use strict';

var React = require('react-native');
var moment = require('moment');

import NavigationBar from '../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var {View, Text, Navigator, DatePickerIOS, StyleSheet} = React;
var Button = require('../common/button.js');

var commonStyle = require('../styles/commonStyle');
var MyDatePicker =  React.createClass({
    getDefaultProps: function () {
        return {
            date: new Date(),
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
        };
    },
    getInitialState: function(){
        return {
            date: this.props.date,
            timeZoneOffsetInHours: this.props.timeZoneOffsetInHours
        };
    },
    onDateChange: function(date) {
        this.setState({date: date});
    },
    onTimezoneChange: function(event) {
        var offset = parseInt(event.nativeEvent.text, 10);
        if (isNaN(offset)) {
          return;
        }
        this.setState({timeZoneOffsetInHours: offset});
    },
    leftButtonConfig: function(){
        var self = this;
        return{
            title: '<',
            handler:() =>
                Actions.pop()
        }
    },
    rightButtonConfig: function(){
        var self = this;
        return{
            title: 'Done',
            handler:() =>
                Actions.pop()
        }
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title:'选择日期'}}
                    leftButton={this.leftButtonConfig()}
                    rightButton={this.rightButtonConfig()}/>
                <DatePickerIOS
                    date={this.state.date}
                    mode="time"
                    timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                    onDateChange={this.onDateChange}
                    minuteInterval={10} />
            </View>
        );
    }
})


module.exports = MyDatePicker;