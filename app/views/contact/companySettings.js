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
    doShare: function(){
        util.presentSnsIconSheetView({
            text: '----test from js',
            image: require('../../images/logo.png'),
            url: 'http://www.nzaom.com'
        },function(res){
            console.log('------res', res);
        });
        var url = 'https://itunes.apple.com/us/app/ni-zao-me/id1025294933?l=zh&ls=1&mt=8'
        // util.link(url)
    },
    doLogout: function(){
        AlertIOS.alert(
            '退出企业',
            '您确定要退出企业吗',
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
                    title={{title: '设置'}}
                    leftButton={<BlueBackButton />} />
                <View style={commonStyle.settingGroups}>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.doShare}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/person/score.png')}/>
                            <Text
                            style={commonStyle.settingDetail}>
                                分享邀请链接
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
                                退出企业
                            </Text>
                        </View>
                    </TouchableHighlight>

                    <Modal ref={(ref)=>{this._modal = ref}}/>
                </View>
            </View>
            );
    }
});