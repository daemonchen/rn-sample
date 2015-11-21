'use strict';

var React = require('react-native');
var util = require('./util.js');
var {
    Navigator,
    StyleSheet
} = React;


var {
    width, height
} = util.getDimensions();

var AppNavigator = React.createClass({
    getDefaultProps: function () {
        return {
            title: '',
            component: null
        };
    },
    renderScene: function(route, navigator){
        return <route.component route={route} navigator={navigator} />;
    },
    render: function () {
        return (
            <Navigator
                style={styles.container}
                tintColor="#fff"
                initialRoute={this.props.initialRoute}
                renderScene={this.renderScene}
                configureScene={(route)=>route.sceneConfig} />
        );
    }
});

var styles = StyleSheet.create({
    container: {
        width: width,
        height: height - 49,
        borderBottomWidth:1 / React.PixelRatio.get(),
        borderBottomColor:'#e1e1e1'
    },
});

module.exports = AppNavigator;