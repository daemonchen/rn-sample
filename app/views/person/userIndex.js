'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
var TimerMixin = require('react-timer-mixin');
var Actions = require('react-native-router-flux').Actions;
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    ActionSheetIOS,
    TouchableOpacity,
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

var avatarAction = require('../../actions/avatar/avatarAction');
var avatarStore = require('../../stores/avatar/avatarStore');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            user: !!appConstants.user ? appConstants.user : {}
        }
    },
    componentWillReceiveProps: function(){
        this.setState({
            user: !!appConstants.user ? appConstants.user : {}
        });
    },
    componentDidMount: function(){
        this.unlisten = avatarStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function(){
        var result = avatarStore.getState();
        if (result.type == 'update') {
            if (result.status != 200 && !!result.message) {
                util.alert('修改失败');
                return;
            }
            appConstants.user = result.data;
            this.setState({
                user: appConstants.user
            });

        };
        if (result.type == 'delete') {
            if (result.status != 200 && !!result.message) {
                util.alert('删除失败');
                return;
            }
            appConstants.user = result.data;
            this.setState({
                user: appConstants.user
            });
        };
    },
    goAccount: function(){
        Actions.userAccount();
    },
    goTemplate: function(){
        Actions.orderTemplates();
    },
    goSettings: function(){
        Actions.mySettings();
    },
    goSuggest: function(){
        Actions.suggest();
    },
    launchImageLibrary: function(){
        util.launchImageLibrary({
            title: '',
            allowsEditing: true,
            noData: true
        }, (response)=>{
            avatarAction.update({
                uri: response.uri,
                params:{}
            });
        });
    },
    launchCamera: function(){
        util.launchCamera({
            title: '',
            noData: true
        }, (response)=>{
            avatarAction.update({
                uri: response.uri,
                params:{}
            });
        });
    },
    doDeleteAvatar: function(){
        avatarAction.delete();
    },
    onSelectActionSheet: function(index){
        switch(index){
            case 0:
                return this.launchCamera();
            case 1:
                return this.launchImageLibrary();
            case 2:
                return this.doDeleteAvatar();
            default :
                return;
        }
    },
    showActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            destructiveButtonIndex: 2,
            cancelButtonIndex: 3,
            },
            (buttonIndex) => {
              self.onSelectActionSheet(buttonIndex);
            });
    },
    actionList: ['拍照', '选择图片', '删除头像', '取消'],
    renderAvatar: function(data){
        if (!data) {
            return(<View style={styles.avatarWrapper}/>);
        };
        if (data.avatar) {
            return(
                <TouchableOpacity
                    onPress={this.showActionSheet}>
                    <Image
                      style={styles.avatar}
                      source={{uri: data.avatar}} />
                </TouchableOpacity>
                );
        }else{
            var circleBackground = {
                backgroundColor: data.bgColor
            }
            return(
                <TouchableOpacity
                    onPress={this.showActionSheet}>
                    <View style={[styles.avatarWrapper, circleBackground]}>
                        <Text style={styles.avatarTitle}>
                            {data.simpleUserName}
                        </Text>
                    </View>
                </TouchableOpacity>
                )
        }
    },
    render: function(){
        return(
            <ScrollView style={commonStyle.container}
                automaticallyAdjustContentInsets={false} >
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
                            source={require('../../images/person/account_settings.png')}/>
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
                            source={require('../../images/person/template.png')}/>
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
                            source={require('../../images/person/setting_fill.png')}/>
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
                            source={require('../../images/person/feedback.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                意见反馈
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </ScrollView>
            );
    }
});