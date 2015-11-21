'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {View, Text, Navigator, StyleSheet} = React;
var Button = require('../../common/button.js');
var tabViewSample = require('../tabViewSample');

var _navigator, _topNavigator = null;

var Home =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    rightButtonConfig:{
        title: 'Forward',
        handler:() =>
            _topNavigator.push({
                title: 'from home' + Math.random(),
                component: tabViewSample,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight
            })

    },
    render:function(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    style={styles.navigatorView}
                    title={{ title: 'Title', }}
                    leftButton={{ title: 'Back', }}
                    rightButton={this.rightButtonConfig} />
                <View style={styles.main}>
                    <Text>Home</Text>
                    <Button>test</Button>
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
        borderTopColor:'#e1e1e1',
        alignItems:'center'
    }
});

module.exports = Home;