'use strict';

var React = require('react-native');
var moment = require('moment');
var {View, Text, Navigator, DatePickerIOS, StyleSheet} = React;
var Button = require('../common/button.js');

var _navigator, _topNavigator = null;
var customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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
    render:function(){
        return (
            <View style={styles.container}>
                <DatePickerIOS
                    date={this.state.date}
                    mode="datetime"
                    timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                    onDateChange={this.onDateChange}
                    minuteInterval={10} />
            </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    }
});

module.exports = MyDatePicker;