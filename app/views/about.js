'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var DeviceInfo = require('react-native-device-info');
var {
    View,
    ListView,
    Image,
    Text,
    Navigator,
    TouchableHighlight,
    StyleSheet
} = React

var commonStyle = require('../styles/commonStyle');
var BlueBackButton = require('../common/blueBackButton');

var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            version: DeviceInfo.getVersion()
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '关于我们'}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />} />
                <View style={styles.main}>
                    <Image
                      source={require('../images/logo/logo_welcom.png')} />
                    <Text>你造么 for iPhone {this.state.version}</Text>
                </View>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main:{
        alignItems: 'center',
        justifyContent: 'center'
    }
});