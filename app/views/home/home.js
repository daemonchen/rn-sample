'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {View, Text, Navigator, StyleSheet} = React;
var Button = require('../../common/button.js');
var tabViewSample = require('../tabViewSample');

var _navigator = null;

var Home =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        return {}
    },
    rightButtonConfig:{
        title: 'Forward',
        handler:() =>
            _navigator.push({
                title: 'from home' + Math.random(),
                component: tabViewSample,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight
            })

    },
    render:function(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: 'Title', }}
                    rightButton={this.rightButtonConfig} />
                <Text>Home</Text>
                <Button>test</Button>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});

module.exports = Home;