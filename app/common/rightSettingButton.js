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
        return(
            <TouchableOpacity onPress={this.onPress}>
                <Image source={require('../images/common/Setting.png')}
                style={[{ width: 24, height: 24, marginRight: 16, marginLeft: 16  }, this.props.style]} />
            </TouchableOpacity>
            );
    }
});

var styles = React.StyleSheet.create({
});