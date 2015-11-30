'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    View,
    Text,
    ListView,
    Navigator,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        return {}
    },
    leftButtonConfig: {
        title: '<',
        handler:() =>
            _navigator.pop()
    },
    render: function(){
        return(
            <View>
                <NavigationBar
                    title={{title: this.props.route.title}}
                    leftButton={this.leftButtonConfig} />
                <Text>
                    this.is template detail
                </Text>
            </View>
            );
    }
});