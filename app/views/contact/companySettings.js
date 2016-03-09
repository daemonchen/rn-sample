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
    ActionSheetIOS,
    TouchableHighlight,
    StyleSheet
} = React

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');
var Modal = require('../../common/modal');
var util = require('../../common/util');

var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');

var BlueBackButton = require('../../common/blueBackButton');


module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            factory: {}
        }
    },
    componentDidMount: function(){
        this.getAppConstants();
    },
    componentWillUnmount: function() {
    },
    _modal: {},
    getAppConstants: function(){
        var self = this;
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data && !!data.xAuthToken){
                appConstants = data;
                this.setTimeout(function(){
                    self.setState({
                        factory: !!appConstants.factory ? appConstants.factory : {}
                    });
                }, 350)
            }
        }).done();
    },
    showShareActionSheet: function() {
        ActionSheetIOS.showShareActionSheetWithOptions({
          url: 'https://code.facebook.com',
          message: 'message to go with the shared url',
          subject: 'a subject to go in the email heading',
          excludedActivityTypes: [
            'com.apple.UIKit.activity.PostToTwitter'
          ]
        },
        (error) => {
          console.error(error);
        },
        (success, method) => {
          var text;
          if (success) {
            text = `Shared via ${method}`;
          } else {
            text = 'You didn\'t share';
          }
          this.setState({text});
        });
    },
    doShare: function(){
        var userId = appConstants.user.userId;
        var userName = appConstants.user.userName;
        var factoryName = appConstants.user.factoryName;
        var link = `http:\/\/www.nzaom.com/h5/invite/${userId}`;
        var title = `邀请你加入${factoryName}`;
        var text = `${userName}在你造么上创建了一个团队-${factoryName}，邀请大家加入。` + link;
        util.presentSnsIconSheetView({
            title: title,
            text: text,
            image: 'http://img01.nzaom.com/logo-mobile-0114logo_welcom.png',
            url: link
        },function(res){
            console.log('------share done with response:', res);
        });
    },
    doDeleteEmployee: function(){
        employeeAction.delete({
            userId: appConstants.user.userId
        });
    },
    doLogout: function(){
        AlertIOS.alert(
            '退出企业',
            '您确定要退出企业吗',
            [
                {text: '确定', onPress: () => {this.doDeleteEmployee()} },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )

    },
    goSheet: function(){
        Actions.webViewWrapper({
            title: '企业报表',
            descriptionUrl: 'http://www.nzaom.com/h5/report/report/index'
        });
    },
    goApplicationList: function(){
        Actions.applicationList();
    },
    goVersionPage: function(){
        console.log('-------appConstants', this.state.factory);
        Actions.webViewWrapper({
            title: '企业等级',
            descriptionUrl:  this.state.factory.levelUrl
        });
    },
    renderCompanyVersionItem: function(){
        return(
            <TouchableHighlight
                style={commonStyle.settingItemWrapper}
                underlayColor='#eee'
                onPress={this.goVersionPage}>
                <View
                style={commonStyle.settingItem}>
                    <Image
                    style={commonStyle.settingIcon}
                    source={require('../../images/contact/version_gray.png')}/>
                    <Text
                    style={commonStyle.settingDetail}>
                        企业等级
                    </Text>
                </View>
            </TouchableHighlight>
            );
    },
    renderApplicationItem: function(){
        var rights = appConstants.userRights.rights;
        var targetRights = 4194304;
        if ((rights & targetRights) == targetRights){
            return(
                <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this.goApplicationList}>
                    <View
                    style={commonStyle.settingItem}>
                        <Image
                        style={commonStyle.settingIcon}
                        source={require('../../images/contact/group_add_gray.png')}/>
                        <Text
                        style={commonStyle.settingDetail}>
                            新的成员
                        </Text>
                    </View>
                </TouchableHighlight>
                );
        }else{
            return(
                <View />
                );
        }
    },
    renderChartItem: function(){
        var rights = appConstants.userRights.rights;
        var targetRights = 4194304;
        if ((rights & targetRights) == targetRights){
            return(
                <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this.goSheet}>
                    <View
                    style={commonStyle.settingItem}>
                        <Image
                        style={commonStyle.settingIcon}
                        source={require('../../images/contact/chart_gray.png')}/>
                        <Text
                        style={commonStyle.settingDetail}>
                            统计报表
                        </Text>
                    </View>
                </TouchableHighlight>
                );
        }else{
            return(
                <View />
                );
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: '设置'}}
                    leftButton={<BlueBackButton />} />
                <View style={commonStyle.settingGroups}>
                    {this.renderChartItem()}
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.doShare}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/contact/link_gary.png')}/>
                            <Text
                            style={commonStyle.settingDetail}>
                                分享邀请链接
                            </Text>
                        </View>
                    </TouchableHighlight>
                    {this.renderApplicationItem()}
                    {this.renderCompanyVersionItem()}
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.doLogout}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/contact/quit_gray.png')}/>
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