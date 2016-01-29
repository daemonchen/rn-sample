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
            <Image style={styles.navTitleImage} source={require('../images/navigator/logo_navigation_bar.png')} />
            );
    }
});

var styles = React.StyleSheet.create({
    navTitleImage: {
        width: 32,
        height: 32,
        marginTop: 10
    }
});