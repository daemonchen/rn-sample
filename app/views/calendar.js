'use strict';

var React = require('react-native');
var CalendarPicker = require('../common/calendarPicker/CalendarPicker');
var NavigationBar = require('react-native-navbar');
var {
    View,
    Text,
    Navigator,
    StyleSheet
} = React;
var Button = require('../common/button.js');
var BlueBackButton = require('../common/blueBackButton');
var RightDoneButton = require('../common/rightDoneButton');

var commonStyle = require('../styles/commonStyle');
var _navigator, _topNavigator = null;

module.exports =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
              date: new Date(),
            };
    },
    onDateChange: function(date) {
        this.setState({ date: date });
    },
    onPressDone: function(){
        this.props.route.onCalendarPressDone(this.state.date);
        _topNavigator.pop();
    },
    render: function() {
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'日历'}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <CalendarPicker
                  selectedDate={this.state.date}
                  onDateChange={this.onDateChange} />
            </View>

        );
    }
})
