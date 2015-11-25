'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    StyleSheet
} = React
/*
orderStatus:enum
0: create
1: update
2: normal
*/
var commonStyle = require('../../styles/commonStyle');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        // _topNavigator = this.props.route.topNavigator;
        return {
            orderStatus: 0
        }
    },
    leftButtonConfig: {
        title: 'X',
        handler:() =>
            _navigator.pop()
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'订单'}}
                    leftButton={this.leftButtonConfig} />
            </View>
            );
    }
});