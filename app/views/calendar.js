'use strict';

var React = require('react-native');
var CalendarPicker = require('rn-calendar');
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
              date: new Date()
            };
    },
    render: function(){
        var holiday = {
          '2015-10-1': '国庆节',
          '2015-9-10': '教师节',
          '2016-1-1': '元旦节',
          '2015-11-11': '双十一'
        };
        var check = {
          '2015-11-21': 'checked',
          '2015-9-1': 'checked',
          '2015-7-10': 'checked',
          '2015-9-10': 'checked'
        };
        var headerStyle ={
          backgroundColor: '#3C9BFD',
          color:'#fff',
          fontSize: 15,
          fontWeight:'500',
        };
        return (
          <View style={styles.container}>
            <CalendarPicker
                touchEvent={this.press}
                headerStyle={headerStyle}
                holiday={holiday}
                check={check} />
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