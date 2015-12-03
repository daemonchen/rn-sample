'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    TouchableHighlight,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var commonStyle = require('../../styles/commonStyle');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    goAccount: function(){
        console.log('todo...');
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '我的账号', }}
                    leftButton={{ title: '<', }} />
                <View style={commonStyle.settingGroups}>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goAccount}>
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            style={commonStyle.settingTitle}>
                                姓名
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                XXX
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/Arrow_back.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            );
    }
});
var styles = StyleSheet.create({
    topInfo:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    avatar:{
        marginTop: 16,
        width: 100,
        height: 100
    },
    nameWrapper: {
        width: width - 32,
        borderBottomWidth: 1 / React.PixelRatio.get(),
        paddingVertical: 22,
        borderBottomColor: '#bdbdbd'
    },
    name: {
        textAlign: 'center',
        fontSize: 22
    }
});