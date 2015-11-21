'use strict';

var React = require('react-native');
var Calendar = require('react-native-calendar');
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
    render:function(){
        return (
            <View style={styles.container}>
                <Calendar
                  ref="calendar"
                  eventDates={['2015-11-03']}
                  scrollEnabled={false}
                  showControls={true}
                  dayHeadings={customDayHeadings}
                  titleFormat={'MMMM YYYY'}
                  prevButtonText={'Prev'}
                  nextButtonText={'Next'}
                  onDateSelect={(date) => this.setState({selectedDate: date})}
                  onTouchPrev={() => console.log('Back TOUCH')}
                  onTouchNext={() => console.log('Forward TOUCH')}
                  onSwipePrev={() => console.log('Back SWIPE')}
                  onSwipeNext={() => console.log('Forward SWIPE')}/>
                <Text>Selected Date: {moment(this.state.selectedDate).format('MMMM DD YYYY')}</Text>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
    }
});

module.exports = MyCalendar;