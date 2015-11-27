'use strict';
/*
这是一个wrapper页面，用来承载每一个任务设置选项的内容页
*/
var React = require('react-native');
var NavigationBar = require('react-native-navbar');
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
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    leftButtonConfig:function() {
        return {
            title: '<',
            handler:() =>
                _navigator.pop()
        }
    },
    rightButtonConfig: function(){
        var self = this;
        return{
            title: 'Done',
            handler:() =>
                _navigator.pop()
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'新建任务'}}
                    leftButton={this.leftButtonConfig()}
                    rightButton={this.rightButtonConfig()}/>
                <View style={styles.main}>
                    <this.props.route.children
                    events={this.props.route.events}/>
                </View>
            </View>
            );
    }
});
var styles = StyleSheet.create({
    main: {
        flex: 1
    }
});