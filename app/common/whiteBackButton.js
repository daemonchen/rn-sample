'use strict';

var React = require('react-native');
var Actions = require('react-native-router-flux').Actions;
var {
    View,
    Text,
    Image,
    Navigator,
    TouchableOpacity,
    StyleSheet
} = React;

module.exports = React.createClass({
    getInitialState: function(){
        return{
            title: ''
        }
    },
    onPress: function(){
        Actions.pop()
    },
    render: function(){
        return(
            <TouchableOpacity onPress={this.onPress}>
                <Image source={require('../images/common/Arrow_back-white.png')}
                style={[{ width: 24, height: 24, marginLeft: 16, marginRight: 16 }, this.props.style]} />
            </TouchableOpacity>
            );
    }
});

var styles = React.StyleSheet.create({
});