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
        if (this.props.title) {
            return(
            <TouchableOpacity onPress={this.onPress}>
                <Text
                style={[{fontSize: 17, width: 36, height: 24, marginTop: 2, marginRight: 16, marginLeft: 8, color: '#4285f4' }, this.props.style]}>
                    {this.props.title}
                </Text>
            </TouchableOpacity>
            );
        };
        return(
            <TouchableOpacity onPress={this.onPress}>
                <Image source={require('../images/common/add.png')}
                style={[{ width: 24, height: 24, marginRight: 16, marginLeft: 16 }, this.props.style]} />
            </TouchableOpacity>
            );
    }
});

var styles = React.StyleSheet.create({
});