'use strict';

var React = require('react-native');
var {AppRegistry, Navigator, StyleSheet,Text,View} = React;
var {Router, Route, Schema, Animations, TabBar} = require('react-native-router-flux');

var Advertisement = require('./advertisement');
var Welcome = require('./welcome');
var Launch = require('./launch');
var About = require('./about');
var Calendar = require('./calendar');
var DatePicker = require('./datePicker');
var Error = require('./error');
var Login = require('./login');
var Register = require('./register');

var OrderDetail = require('./order/orderDetail');
var OrderSettings = require('./order/orderSettings');
var OrderSettingsForTemplate = require('./order/orderSettingsForTemplate');
var OrderTemplates = require('./order/orderTemplates');

var AttachDetail = require('./order/attach/attachDetail');
var AttachSetting = require('./order/attach/attachSetting');
var TaskAttach = require('./order/attach/taskAttach');

var SettingsWrapper = require('./order/task/settingsWrapper');
var TaskDetail = require('./order/task/taskDetail');
var TaskDetailForWorkbench = require('./order/task/taskDetailForWorkbench');
var TaskSettings = require('./order/task/taskSettings');

var OrderTemplateDetail = require('./order/templates/orderTemplateDetail');
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

module.exports = React.createClass({
    getInitialState: function () {
        return {};
    },
    componentDidMount: function(){
    },
    componentWillUnmount: function() {
    },
    render: function() {
        return (
            <Router hideNavBar={true} initialRoutes={['advertisement']}>
                <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
                <Schema name="withoutAnimation"/>

                <Route name="advertisement" component={Advertisement} wrapRouter={true} title="Advertisement" hideNavBar={true}/>
                <Route name="welcome" component={Welcome} title="welcome" type="replace" schema="modal"/>
                <Route name="launch" component={Launch} title="launch" type="replace"/>
                <Route name="about" component={About} title="设置"/>
                <Route name="calendar" component={Calendar} title="设置"/>
                <Route name="datePicker" component={DatePicker} title="设置"/>
                <Route name="error" component={Error} title="设置"/>
                <Route name="login" component={Login} title="设置"/>
                <Route name="register" component={Register} title="设置"/>

                <Route name="userAccount" component={UserAccount} title="我的账号"/>
                <Route name="mySettings" component={MySettings} title="设置"/>
                <Route name="suggest" component={Suggest} title="意见反馈"/>
                <Route name="changeName" component={ChangeName} title="意见反馈"/>
                <Route name="changePassword" component={ChangePassword} title="意见反馈"/>
                <Route name="resetPassword" component={ResetPassword} title="意见反馈"/>
                <Route name="setPassword" component={SetPassword} title="意见反馈"/>
                <Route name="validationCode" component={ValidationCode} title="意见反馈"/>

                <Route name="orderDetail" component={OrderDetail} title="我的模版"/>
                <Route name="orderSettings" component={OrderSettings} title="我的模版"/>
                <Route name="orderSettingsForTemplate" component={OrderSettingsForTemplate} title="我的模版"/>
                <Route name="orderTemplates" component={OrderTemplates} title="我的模版"/>

                <Route name="attachDetail" component={AttachDetail} title="我的模版"/>
                <Route name="attachSetting" component={AttachSetting} title="我的模版"/>
                <Route name="taskAttach" component={TaskAttach} title="我的模版"/>

                <Route name="settingsWrapper" component={SettingsWrapper} title="我的模版"/>
                <Route name="taskDetail" component={TaskDetail} title="我的模版"/>
                <Route name="taskDetailForWorkbench" component={TaskDetailForWorkbench} title="我的模版"/>
                <Route name="taskSettings" component={TaskSettings} title="我的模版"/>

                <Route name="orderTemplateDetail" component={OrderTemplateDetail} title="我的模版"/>
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
