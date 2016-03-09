'use strict';

var React = require('react-native');
var CalendarPicker = require('../common/calendarPicker/CalendarPicker');
import NavigationBar from '../common/react-native-navbar/index'
var Actions = require('react-native-router-flux').Actions;
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

module.exports =  React.createClass({
    getInitialState: function(){
        return {
              date: new Date(),
            };
    },
    onDateChange: function(date) {
        this.setState({ date: date });
    },
    onPressDone: function(){
        this.props.onCalendarPressDone(this.state.date);
        Actions.pop();
    },
    render: function() {
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title:'日历'}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <CalendarPicker
                  selectedDate={this.state.date}
                  onDateChange={this.onDateChange} />
            </View>

        );
    }
})
