'use strict';

var React = require('react-native');
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
        this.props.navigator.pop()
    },
    render: function(){
        return(
            <TouchableOpacity onPress={this.onPress}>
                <Image source={require('../images/common/Arrow_back-white.png')}
                style={[{ width: 20, height: 20, marginLeft: 8 }, this.props.style]} />
            </TouchableOpacity>
            );
    }
});

var styles = React.StyleSheet.create({
});