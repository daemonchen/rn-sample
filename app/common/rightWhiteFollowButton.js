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
        this.props.onPress()
    },
    render: function(){
        var uri = this.props.status ? require('../images/follow/follow_fill_white.png') : require('../images/follow/follow_outling_white.png');
        return(
            <TouchableOpacity onPress={this.onPress}>
                <Image source={uri}
                style={[{ width: 24, height: 24, marginRight: 8, marginLeft: 16 }, this.props.style]} />
            </TouchableOpacity>
            );
    }
});

var styles = React.StyleSheet.create({
});