'use strict';

var React = require('react-native');
var moment = require('moment');
import NavigationBar from 'react-native-navbar'
var {View, Text, Navigator, DatePickerIOS, StyleSheet} = React;
var Button = require('../common/button.js');

var _navigator, _topNavigator = null;
var commonStyle = require('../styles/commonStyle');
var MyDatePicker =  React.createClass({
    getDefaultProps: function () {
        return {
            date: new Date(),
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
        };
    },
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
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
                _navigator.pop()
        }
    },
    rightButtonConfig: function(){
        var self = this;
        return{
            title: 'Done',
            handler:() =>
                _navigator.pop()
        }
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
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