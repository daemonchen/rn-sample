'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var Actions = require('react-native-router-flux').Actions;
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  ActivityIndicatorIOS,
  Image,
  Text,
  View,
} = React;



var commonStyle = require('../styles/commonStyle');

var Modal = require('../common/modal');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {}
    },
    _modal: {},
    componentDidMount: function(){

    },
    componentWillUnmount: function() {

    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <View style={{width: width, height: height, backgroundColor: '#fff'}}>
                    <ActivityIndicatorIOS
                        animating={true}
                        style={[commonStyle.activityIndicator, {height: 80}]}
                        size="small" />
                </View>
                  <Modal ref={(ref)=>{this._modal = ref}}/>
            </View>
        );
    }
});
