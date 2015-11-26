'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    TouchableOpacity,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');

var Task = require('./task/task');
var OrderDetailSegmentControl = require('./components/orderDetailSegmentControl');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            orderStatus: 0
        }
    },
    leftButtonConfig:function() {
        return {
            title: '<',
            handler:() =>
                _navigator.pop()
        }
    },
    rightButtonConfig: function(){
        var self = this;
        return{
            title: '+',
            handler:() =>
                _navigator.pop()
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: this.props.route.title, }}
                    leftButton={this.leftButtonConfig()}
                    rightButton={this.rightButtonConfig()} />
                <View style={styles.main}>
                    <OrderDetailSegmentControl />
                    <Task />
                </View>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main: {
        flex: 1
    }
});