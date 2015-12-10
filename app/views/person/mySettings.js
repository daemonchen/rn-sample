'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var TimerMixin = require('react-timer-mixin');
var {
    View,
    ListView,
    Image,
    Text,
    Navigator,
    AlertIOS,
    TouchableHighlight,
    StyleSheet
} = React

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');
var Modal = require('../../common/modal');

var userAction = require('../../actions/user/userAction');
var userStore = require('../../stores/user/userStore');
var loginAction = require('../../actions/user/loginAction');
var loginStore = require('../../stores/user/loginStore');

var BlueBackButton = require('../../common/blueBackButton');

var About = require('../about');
var ChangePassword = require('./changePassword');
var Welcome = require('../welcome');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    componentDidMount: function(){
        this.unlisten = loginStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = loginStore.getState();
        if (result.type != 'logout') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        appConstants = {};
        asyncStorage.setItem('appConstants', appConstants);
        _navigator.immediatelyResetRouteStack([{
            title: 'welcome',
            component: Welcome,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _navigator
        }])
    },
    _modal: {},
    doRate: function(){
        console.log('TODO: open app store to set score...');
    },
    goAbout: function(){
        _navigator.push({
            title:'关于我们',
            component: About,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    cleanCache: function(){
        appConstants.orderList = null;
        appConstants.taskList = null;
        appConstants.attachList = null;
        appConstants.commentList = null;
        appConstants.workbenchList = null;
        appConstants.newsList = null;
        asyncStorage.setItem('appConstants', appConstants)
        .then((error)=>{
            if (!!error) {
                this._modal.showModal('缓存清除失败');
            }else{
                this._modal.showModal('缓存清除成功');
            }
            if (this._timeout) {
                this.clearTimeout(this._timeout);
            };
            this._timeout = this.setTimeout(()=>{
                this._modal.hideModal();
            },2000);
        });
    },
    goChangePassword: function(){
        _navigator.push({
            title:'修改密码',
            component: ChangePassword,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    doLogout: function(){
        console.log('---doLogout');
        AlertIOS.alert(
            '退出登录',
            '您确定要退出登录吗',
            [
                {text: '确定', onPress: () => {loginAction.logout()} },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )

        // _navigator.replace();
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '设置'}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />} />
                <View style={commonStyle.settingGroups}>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.doRate}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/person/score.png')}/>
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
                            source={require('../../images/person/logo_gray.png')}/>
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
                            source={require('../../images/person/clear.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                清除缓存
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
                        style={commonStyle.logoutWrapper}
                        underlayColor='#eee'>
                        <View style={commonStyle.logoutBorder}>
                            <Button
                            style={[commonStyle.button, commonStyle.red]}
                            onPress={this.doLogout} >
                                退出登录
                            </Button>
                        </View>
                    </TouchableHighlight>
                    <Modal ref={(ref)=>{this._modal = ref}}/>
                </View>
            </View>
            );
    }
});