'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var {AppRegistry, Navigator, StyleSheet,Text,View} = React;
var {Router, Route, Schema, Animations, TabBar, Actions} = require('react-native-router-flux');

var Advertisement = require('./advertisement');
var Welcome = require('./welcome');
var Launch = require('./launch');
var About = require('./about');
var Calendar = require('./calendar');
var DatePicker = require('./datePicker');
var Error = require('./error');
var Login = require('./login');
var Register = require('./register');
var ImageSwiperPage = require('./imageSwiperPage');

var OrderDetail = require('./order/orderDetail');
var OrderSettings = require('./order/orderSettings');
var OrderSettingsForTemplate = require('./order/orderSettingsForTemplate');
var OrderTemplates = require('./order/orderTemplates');

var AttachDetail = require('./order/attach/attachDetail');
var AttachSetting = require('./order/attach/attachSetting');
var TaskAttach = require('./order/attach/taskAttach');

var SettingsWrapper = require('./order/task/settingsWrapper');
var TaskDetail = require('./order/task/taskDetail');
var TaskDescribe = require('./order/task/taskDescribe');
var TaskSettings = require('./order/task/taskSettings');

var OrderTemplateSetting = require('./order/templates/orderTemplateSetting');

var InviteMessage = require('./inbox/inviteMessage');
var SysMessage = require('./inbox/sysMessage');

var CompanyMemberList = require('./contact/companyMemberList');
var ContactDetail = require('./contact/contactDetail');
var CreateFactory = require('./contact/createFactory');
var CustomerList = require('./contact/customerList');
var CustomerSettings = require('./contact/customerSettings');
var InviteEmployee = require('./contact/inviteEmployee');
var PositionSetting = require('./contact/positionSetting');
var RoleSetting = require('./contact/roleSetting');

var UserAccount = require('./person/userAccount');
var MySettings = require('./person/mySettings');
var Suggest = require('./person/suggest');
var ChangeName = require('./person/changeName');
var ChangePassword = require('./person/changePassword');
var ResetPassword = require('./person/resetPassword');
var SetPassword = require('./person/setPassWord');
var ValidationCode = require('./person/validationCode');

var systemAction = require('../actions/system/systemAction');
var appAction = require('../actions/app/appAction');

var systemStore = require('../stores/system/systemStore');
var loginStore = require('../stores/user/loginStore');
var authTokenStore = require('../stores/user/authTokenStore');
var verifyCodeStore = require('../stores/user/verifyCodeStore');

var appConstants = require('../constants/appConstants');
var asyncStorage = require('../common/storage');
var util = require('../common/util.js');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function () {
        return {};
    },
    componentDidMount: function(){
        this.unlisten = systemStore.listen(this.onChange);
        this.unlistenLogin = loginStore.listen(this.onLoginChange);
        this.unAuthTokenlisten = authTokenStore.listen(this.onAuthTokenChange);
        this.unlistenVerifyCode = verifyCodeStore.listen(this.onVerifyCodeChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenLogin();
        this.unAuthTokenlisten();
        this.unlistenVerifyCode();
    },
    onVerifyCodeChange: function(){
        var result = verifyCodeStore.getState();
        if (result.type != 'register') {return};
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        return this.doLogin(result);
    },
    onAuthTokenChange: function(){
        var result = authTokenStore.getState();
        if (result.status != 200 && !!result.message) {
            this.goWelcome();
            return;
        }
        switch(result.type){
            case 'updateToken':
                return this.doLogin(result);
            default: return;
        }
    },
    onLoginChange: function(){
        var result = loginStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'login':
                return this.doLogin(result);
            case 'logout':
                return this.doLogout(result);
            default: return;
        }
    },
    doLogin: function(result){
        appConstants.xAuthToken = result.data.token;
        appConstants.user = result.data.user;
        appConstants.userRights = result.data.userRights;
        asyncStorage.setItem('appConstants', appConstants);
        this.setTimeout(function(){
            appAction.init(appConstants);
        }, 350)
        this.getAppState();
    },
    doLogout: function(){
        appConstants = {};
        asyncStorage.setItem('appConstants', appConstants);
        this.goWelcome();
    },
    getAppState: function(){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            systemAction.init();
        }, 350);
    },
    onChange: function(){
        var result = systemStore.getState();
        if (result.type != 'init') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        appConstants.unreadMsg = result.data.unreadMsg;
        this.setTimeout(function(){
            appAction.init(appConstants);
        }, 350)
        asyncStorage.setItem('appConstants', appConstants)
        .then(()=>{
            this.doLaunch();
        });;

    },
    goWelcome: function(){
        Actions.welcome();
    },
    goLaunch: function(){
        Actions.launch();
    },
    doLaunch: function(){
        if (!appConstants.user) {
            this.goWelcome();
        }else{
            this.goLaunch();
        }
    },
    render: function() {
        return (
            <Router hideNavBar={true} initialRoutes={['advertisement']}>
                <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
                <Schema name="withoutAnimation"/>

                <Route name="advertisement" component={Advertisement} wrapRouter={true} title="Advertisement" hideNavBar={true}/>
                <Route name="welcome" component={Welcome} title="welcome" type="reset" schema="modal"/>
                <Route name="launch" component={Launch} title="launch" type="reset"/>
                <Route name="about" component={About} title="关于我们"/>
                <Route name="calendar" component={Calendar} title="设置日期"/>
                <Route name="datePicker" component={DatePicker} title="设置时间"/>
                <Route name="error" component={Error} title="设置"/>
                <Route name="login" component={Login} title="登录" />
                <Route name="register" component={Register} title="注册"/>
                <Route name="imageSwiperPage" component={ImageSwiperPage} title="图片详情" schema="withoutAnimation"/>


                <Route name="userAccount" component={UserAccount} title="我的账号"/>
                <Route name="mySettings" component={MySettings} title="设置"/>
                <Route name="suggest" component={Suggest} title="意见反馈"/>
                <Route name="changeName" component={ChangeName} title="意见反馈"/>
                <Route name="changePassword" component={ChangePassword} title="修改密码"/>
                <Route name="resetPassword" component={ResetPassword} title="意见反馈"/>
                <Route name="setPassword" component={SetPassword} title="意见反馈"/>
                <Route name="validationCode" component={ValidationCode} title="意见反馈"/>

                <Route name="orderDetail" component={OrderDetail} title="我的模版"/>
                <Route name="orderSettings" component={OrderSettings} title="新建订单"/>
                <Route name="orderSettingsForTemplate" component={OrderSettingsForTemplate} title="我的模版"/>
                <Route name="orderTemplates" component={OrderTemplates} title="选择模版"/>

                <Route name="attachDetail" component={AttachDetail} title="我的模版"/>
                <Route name="attachSetting" component={AttachSetting} title="我的模版"/>
                <Route name="taskAttach" component={TaskAttach} title="我的模版"/>

                <Route name="settingsWrapper" component={SettingsWrapper} title="我的模版"/>
                <Route name="taskDetail" component={TaskDetail} title="任务详情"/>
                <Route name="taskSettings" component={TaskSettings} title="我的模版"/>
                <Route name="taskDescribe" component={TaskDescribe} title="任务描述"/>

                <Route name="orderTemplateSetting" component={OrderTemplateSetting} title="我的模版"/>

                <Route name="inviteMessage" component={InviteMessage} title="我的模版"/>
                <Route name="sysMessage" component={SysMessage} title="我的模版"/>

                <Route name="companyMemberList" component={CompanyMemberList} title="我的模版"/>
                <Route name="contactDetail" component={ContactDetail} title="我的模版"/>
                <Route name="createFactory" component={CreateFactory} title="我的模版"/>
                <Route name="customerList" component={CustomerList} title="我的模版"/>
                <Route name="customerSettings" component={CustomerSettings} title="我的模版"/>
                <Route name="inviteEmployee" component={InviteEmployee} title="我的模版"/>
                <Route name="positionSetting" component={PositionSetting} title="我的模版"/>
                <Route name="roleSetting" component={RoleSetting} title="我的模版"/>

            </Router>

        );
    }
});