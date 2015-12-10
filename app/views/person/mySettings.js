'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    View,
    ListView,
    Image,
    Text,
    Navigator,
    TouchableHighlight,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');
var about = require('../about');
var changePassword = require('./changePassword');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    leftButtonConfig: {
        title: '<',
        handler:() =>
            _navigator.pop()
    },
    doRate: function(){
        console.log('TODO: open app store to set score...');
    },
    goAbout: function(){
        _navigator.push({
            title:'关于我们',
            component: about,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    cleanCache: function(){
        console.log('TODO: clean app cache...');
    },
    goChangePassword: function(){
        _navigator.push({
            title:'修改密码',
            component: changePassword,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'设置'}}
                    leftButton={this.leftButtonConfig} />
                <View style={commonStyle.settingGroups}>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.doRate}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                给我评分
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goAbout}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                关于我们
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.cleanCache}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                清楚缓存
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goChangePassword}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                修改密码
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goChangePassword}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                退出登录
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            );
    }
});