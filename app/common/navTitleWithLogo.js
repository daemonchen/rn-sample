'use strict';

var React = require('react-native');
var {
    View,
    Text,
    Image,
    Navigator,
    StyleSheet
} = React;

module.exports = React.createClass({
    getInitialState: function(){
        return{
            title: ''
        }
    },
    render: function(){
        return(
            <Image style={styles.navTitleImage} source={require('../images/logo.png')} />
            );
    }
});

var styles = React.StyleSheet.create({
    navTitleImage: {
        width: 44,
        height: 44
    }
});