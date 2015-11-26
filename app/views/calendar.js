'use strict';

var React = require('react-native');
var CalendarPicker = require('../common/calendarPicker/CalendarPicker');
var {
    View,
    Text,
    Navigator,
    StyleSheet
} = React;
var Button = require('../common/button.js');
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
    render: function() {
        return (
            <View style={commonStyle.container}>
                <CalendarPicker
                  selectedDate={this.state.date}
                  onDateChange={this.onDateChange} />

                <Text style={[commonStyle.blue,commonStyle.textInput]}>
                    Date:  { this.state.date.toString() }
                </Text>
            </View>

        );
    }
})
