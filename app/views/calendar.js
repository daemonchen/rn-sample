'use strict';

var React = require('react-native');
var CalendarPicker = require('../common/calendarIOS');
var moment = require('moment');
var {View, Text, Navigator, StyleSheet} = React;
var Button = require('../common/button.js');

var _navigator, _topNavigator = null;
var customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
var MyCalendar =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
              selectedDate: moment().format()
            };
    },
    render: function() {
    return (
        <View style={styles.container}>
            <CalendarPicker
              // ref="calendar"
              // eventDates={['2015-07-03', '2015-07-05', '2015-07-10', '2015-07-15', '2015-07-20', '2015-07-25', '2015-07-28', '2015-07-30']}
              // scrollEnabled={true}
              // showControls={true}
              // dayHeadings={customDayHeadings}
              // titleFormat={'MMMM YYYY'}
              // prevButtonText={'Prev'}
              // nextButtonText={'Next'}
              onDateSelect={(date) => this.setState({selectedDate: date})}
              onTouchPrev={() => console.log('Back TOUCH')}
              onTouchNext={() => console.log('Forward TOUCH')}
              onSwipePrev={() => console.log('Back SWIPE')}
              onSwipeNext={() => console.log('Forward SWIPE')}/>
            <Text>Selected Date: {moment(this.state.selectedDate).format('MMMM DD YYYY')}</Text>
        </View>

        );
    },
    press: function(str){
        console.log(str);
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20
    }
});

module.exports = MyCalendar;