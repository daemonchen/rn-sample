'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var DeviceInfo = require('react-native-device-info');
var {
    View,
    ListView,
    Image,
    Text,
    TouchableHighlight,
    StyleSheet
} = React

var commonStyle = require('../styles/commonStyle');
var BlueBackButton = require('../common/blueBackButton');


module.exports = React.createClass({
    getInitialState: function(){
        return {
            version: DeviceInfo.getVersion()
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '关于我们'}}
                    leftButton={<BlueBackButton />} />
                <View style={styles.main}>
                    <Image
                      source={require('../images/logo/logo_welcom.png')} />
                    <Text>你造么 for iPhone {this.state.version}</Text>
                </View>
                <View style={commonStyle.copyright}>
                    <Text style={[commonStyle.textLight, commonStyle.copyrightItem]}>©造么科技</Text>
                    <Text style={[commonStyle.textLight, commonStyle.copyrightItem]}>www.nzaom.com</Text>
                </View>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});