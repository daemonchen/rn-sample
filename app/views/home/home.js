'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {
    View,
    Text,
    Navigator,
    StyleSheet
} = React;
var tabViewSample = require('../tabViewSample');
var HomeSegmentControl = require('./homeSegmentControl');
var HomeList = require('./homeList');

var _navigator, _topNavigator = null;

var Home =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    rightButtonConfig:{
        title: 'Search',
        handler:() =>
            _topNavigator.push({
                title: 'from home' + Math.random(),
                component: tabViewSample,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                topNavigator: _topNavigator
            })

    },
    render:function(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: '工作台', }}
                    leftButton={{ title: '+', }}
                    rightButton={this.rightButtonConfig} />
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