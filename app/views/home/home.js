'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {
    View,
    Text,
    Navigator,
    ActionSheetIOS,
    StyleSheet
} = React;
var tabViewSample = require('../tabViewSample');
var HomeSegmentControl = require('./homeSegmentControl');
var HomeList = require('./homeList');

var RightAddButton = require('../../common/rightAddButton');

var _navigator, _topNavigator = null;

var Home =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            clicked: 'none'
        }
    },
    showActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 2,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
              self.setState({ clicked: self.actionList[buttonIndex] });
            });
    },
    actionList: ['订单','任务','取消'],
    render:function(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: '工作台', }}
                    rightButton={<RightAddButton onPress={this.showActionSheet} />} />
                <View style={styles.main}>
                    <HomeSegmentControl />
                    <HomeList />
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main:{
        flex:1,
        borderTopWidth:1 / React.PixelRatio.get(),
        borderTopColor:'#e1e1e1'
    }
});

module.exports = Home;