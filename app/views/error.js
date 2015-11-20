'use strict';

var React = require('react-native');
var {View, Text, StyleSheet} = React;
var Button = require('../common/button.js');

class Error extends React.Component {
    render(){
        return (
            <View style={{width:300,height:300,justifyContent: 'center',
        alignItems: 'center',backgroundColor:'white'}}>
                <Text>{this.props.data}</Text>
                <Button>Close</Button>
            </View>
        );
    }
}


module.exports = Error;