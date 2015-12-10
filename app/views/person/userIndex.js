'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
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

var appConstants = require('../../constants/appConstants');
var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/person/style');

var UserAccount = require('./userAccount');
var OrderTemplates = require('../order/orderTemplates');
var MySettings = require('./mySettings');
var Suggest = require('./suggest');

var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            user: appConstants.systemInfo.user
        }
    },
    goAccount: function(){
        _topNavigator.push({
            title:'我的账号',
            component: UserAccount,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    goTemplate: function(){

        _topNavigator.push({
            title: '我的模版',
            target: 2,
            component: OrderTemplates,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    goSettings: function(){
        _topNavigator.push({
            title:'设置',
            component: MySettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    goSuggest: function(){
        _topNavigator.push({
            title:'意见反馈',
            component: Suggest,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    renderAvatar: function(data){
        if (!data) {
            return(<View style={styles.avatarWrapper}/>);
        };
        if (data.avatar) {
            return(
                <Image
                  style={styles.avatar}
                  source={{uri: data.avatar}} />
                );
        }else{
            console.log('---data', data);
            var circleBackground = {
                backgroundColor: data.bgColor
            }
            return(
                <View style={[styles.avatarWrapper, circleBackground]}>
                    <Text style={styles.avatarTitle}>
                        {data.simpleUserName}
                    </Text>
                </View>
                )
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <View style={styles.topInfo}>
                    {this.renderAvatar(this.state.user)}
                    <View style={styles.nameWrapper}>
                        <Text style={styles.name}>
                            {this.state.user.userName}
                        </Text>
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