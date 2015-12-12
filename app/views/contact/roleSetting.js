'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    TextInput,
    Navigator,
    StyleSheet
} = React;

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button');
var Checkbox = require('../../common/checkbox');
var Modal = require('../../common/modal');

var userAction = require('../../actions/user/userAction');
var userStore = require('../../stores/user/userStore');
var roleAction = require('../../actions/role/roleAction');
var roleStore = require('../../stores/role/roleStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var _navigator, _topNavigator = null;
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            roleList: [],
            roleId: this.props.route.data.roleId || 0,
            targetUserId: this.props.route.data.userId || 0
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = userStore.listen(this.onChange)
        this.unlistenRole = roleStore.listen(this.onRoleChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(this.fetchRole, 350);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenRole()
    },
    onRoleChange: function(){
        var result = roleStore.getState();
        if (result.type != 'get') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this.setState({
            roleList: result.data
        });
    },
    fetchRole: function(){
        roleAction.get();
    },
    onChange: function() {
        var result = userStore.getState();
        if (result.type == 'update') {
            if (result.status != 200 && !!result.message) {
                return;
            }
            this._modal.showModal('修改角色成功');
            if (this._timeout) {
                this.clearTimeout(this._timeout);
            };
            this._timeout = this.setTimeout(()=>{
                this._modal.hideModal();
                _navigator.pop();
            },2000);

        };
    },
    onCheck: function(role, isSelected){
        if (!!isSelected) {
            this.setState({
                roleId: role
            });
        };
    },
    doCommit: function(){
        userAction.update({
            roleId: this.state.roleId,
            targetUserId: this.state.targetUserId
        });
    },
    onPressDone: function(){
        this.doCommit();
    },
    renderItem: function(item){
        var checked = (this.state.roleId == item.role)
        return(
            <View style={commonStyle.textInputWrapper}>
                <Checkbox
                    label={item.name}
                    checked={checked}
                    onChange={(checked) => this.onCheck(item.role, checked)} />
            </View>
            );
    },
    renderItems: function(list){
        var self = this;
        var items = list.map(function(item, index){
            return self.renderItem(item);
        });
        return(
            <View>
                {items}
            </View>
            );
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '设置角色'}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    {this.renderItems(this.state.roleList)}
                    <Modal ref={(ref)=>{this._modal = ref}}/>
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});