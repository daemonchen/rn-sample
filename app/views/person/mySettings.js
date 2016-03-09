'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var TimerMixin = require('react-timer-mixin');
var Actions = require('react-native-router-flux').Actions;
var {
    View,
    ListView,
    Image,
    Text,
    AlertIOS,
    TouchableHighlight,
    StyleSheet
} = React

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');
var Modal = require('../../common/modal');
var util = require('../../common/util');


var loginAction = require('../../actions/user/loginAction');
var loginStore = require('../../stores/user/loginStore');

var BlueBackButton = require('../../common/blueBackButton');

var About = require('../about');
var ChangePassword = require('./changePassword');
var Welcome = require('../welcome');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {}
    },
    componentDidMount: function(){
    },
    componentWillUnmount: function() {
    },
    _modal: {},
    doRate: function(){
        var url = 'https://itunes.apple.com/us/app/ni-zao-me/id1025294933?l=zh&ls=1&mt=8'
        util.link(url)
    },
    goAbout: function(){
        Actions.about();
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
                util.toast('缓存清除失败');
            }else{
                util.toast('缓存清除成功');
            }

        });
    },
    goChangePassword: function(){
        Actions.changePassword();
    },
    doLogout: function(){
        AlertIOS.alert(
            '退出登录',
            '您确定要退出登录吗',
            [
                {text: '确定', onPress: () => {loginAction.logout()} },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )

    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: '设置'}}
                    leftButton={<BlueBackButton />} />
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
                            style={commonStyle.settingDetail}>
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
                            style={commonStyle.settingDetail}>
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
                            style={commonStyle.settingDetail}>
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
                            source={require('../../images/person/encryption.png')}/>
                            <Text
                            style={commonStyle.settingDetail}>
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