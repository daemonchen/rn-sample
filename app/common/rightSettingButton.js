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
                // <Image source={require('../images/common/setting.png')}
                // style={[{ width: 24, height: 24, marginRight: 16, marginLeft: 16  }, this.props.style]} />
        return(
            <TouchableOpacity onPress={this.onPress}>
                <Text
                style={[{fontSize: 16, width: 36, height: 24, marginTop: 2, marginRight: 16, marginLeft: 16, color: '#4285f4' }, this.props.style]}>
                    设置
                </Text>
            </TouchableOpacity>
            );
    }
});

var styles = React.StyleSheet.create({
});