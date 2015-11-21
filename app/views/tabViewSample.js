'use strict';

var React = require('react-native');
var {View, Text, StyleSheet} = React;
var CircleProgressView = require('../common/circleProgress')
var _navigator, _topNavigator = null;
var TabView = React.createClass ({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            progress:0.3
        }
    },
    render: function(){
        return (
            <View style={styles.container}>
                <Text style={{textAlign:'center', marginTop: 64}}>Tab1 #{this.props.route.title}</Text>
                <CircleProgressView
                  progress={this.state.progress}
                  lineWidth={5}
                  lineCap={CircleProgressView.LineCapSquare}   // LineCapButt | LineCapRound | LineCapSquare
                  circleRadius={20}
                  circleColor='#ff7300'
                  circleUnderlayColor='#e6e6e6'
                  style={styles.circle}/>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        alignItems: 'center'
    },
    circle:{
    }
});

module.exports = TabView;