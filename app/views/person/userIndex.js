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
    StyleSheet
} = React

var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var commonStyle = require('../../styles/commonStyle');
var UserAccount = require('./userAccount');
var OrderTemplates = require('../order/orderTemplates');
var MySettings = require('./mySettings');
var Suggest = require('./suggest');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    goAccount: function(){
        _navigator.push({
            title:'我的账号',
            component: UserAccount,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    goTemplate: function(){

        _navigator.push({
            title: '我的模版',
            target: 2,
            component: OrderTemplates,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    goSettings: function(){
        _navigator.push({
            title:'设置',
            component: MySettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    goSuggest: function(){
        _navigator.push({
            title:'意见反馈',
            component: Suggest,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <View style={styles.topInfo}>
                    <Image
                      style={styles.avatar}
                      source={require('../../images/logo.png')} />
                    <View style={styles.nameWrapper}>
                        <Text style={styles.name}>name stuff</Text>
                    </View>
                </View>
                <View style={commonStyle.settingGroups}>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goAccount}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                我的账号
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goTemplate}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                我的模版
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goSettings}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                设置
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goSuggest}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/Setting.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                意见反馈
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            );
    }
});
var styles = StyleSheet.create({
    topInfo:{
        // height: 174,
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