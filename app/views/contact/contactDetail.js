'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/person/style');
var util = require('../../common/util');
var Button = require('../../common/button.js');

var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');
var userAction = require('../../actions/user/userAction');
var userStore = require('../../stores/user/userStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightSettingButton = require('../../common/rightSettingButton');

var CustomerSettings = require('./customerSettings');
var RoleSetting = require('./roleSetting');
var PositionSetting = require('./positionSetting');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            group: this.props.route.data.group,//1: 工厂员工 2: 客户,
            data: this.props.route.data
        }
    },
    componentDidMount: function(){
        this.unlisten = userStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = userStore.getState();
        if (result.type == 'update') {
            if (result.status != 200 && !!result.message) {
                return;
            }
            if (result.data.userId == this.state.data.userId) {
                this.props.route.data.roleName = result.data.roleName;
                this.props.route.data.position = result.data.position;
                this.setState({
                    data: this.props.route.data
                });
            };
        };
    },
    goSetting: function(){
        _navigator.push({
            title: '编辑客户',
            target: 2,
            data: this.props.route.data,
            component: CustomerSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    doDeleteEmployee: function(){
        employeeAction.delete({
            userId: this.state.data.userId
        });
    },
    renderNavigationBar: function(){
        if (this.state.group == 1) {//1: 工厂员工
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    leftButton={<BlueBackButton navigator={_navigator}/>} />
                );

        }else{//1: 客户
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    leftButton={<BlueBackButton navigator={_navigator}/>}
                    rightButton={<RightSettingButton onPress={this.goSetting} />} />
                );
        }
    },
    renderAvatar: function(){
        var data = this.state.data;
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
    goRoleSetting: function(){
        _navigator.push({
            title: '编辑角色',
            data: this.props.route.data,
            component: RoleSetting,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    goPositionSetting: function(){
        _navigator.push({
            title: '编辑职位',
            data: this.props.route.data,
            component: PositionSetting,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    doCall: function(){
        if (this.state.data.mobiles.length == 0) {return;};
        var url = 'tel:' + this.state.data.mobiles[0];
        util.link(url);
    },
    renderContent: function(){
        if (this.state.group == 1) {//工厂
            return(
                <View>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.doCall}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                手机号码
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.data.mobiles[0]}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goPositionSetting}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                职位
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.data.position}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goRoleSetting}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                角色
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.data.roleName}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
                )
        }
        if (this.state.group == 2) {//客户
            return(
                <View>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.doCall}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                手机号码
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                            {this.state.data.mobiles[0]}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                公司
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                            {this.state.data.company}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingTitle}>
                                职务
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                            {this.state.data.position}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                )
        }
        return(
            <View />
            );
    },
    renderDeleteButton: function(){
        if (this.state.group == 2) {
            return(
                <View />
                );
        };
        return(
            <TouchableHighlight
                style={commonStyle.logoutWrapper}
                underlayColor='#eee'>
                <View style={commonStyle.logoutBorder}>
                    <Button
                    style={[commonStyle.button, commonStyle.red]}
                    onPress={this.doDeleteEmployee} >
                        删除成员
                    </Button>
                </View>
            </TouchableHighlight>
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.topInfo}>
                    {this.renderAvatar()}
                    <View style={styles.nameWrapper}>
                        <Text style={styles.name}>
                            {this.state.data.userName}
                        </Text>
                    </View>
                </View>
                <View style={commonStyle.settingGroups}>
                {this.renderContent()}
                {this.renderDeleteButton()}
                </View>
            </View>
            );
    }
});