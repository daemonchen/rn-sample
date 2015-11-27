'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../../styles/commonStyle');

module.exports = React.createClass({
    getInitialState: function(){
        return {}
    },
    render: function(){
        return(
            <View>
                <Text>this is the task detail</Text>
            </View>
            );
    }
})