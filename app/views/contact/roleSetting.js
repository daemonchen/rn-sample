'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    TextInput,
    StyleSheet
} = React;

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button');
var Checkbox = require('../../common/checkbox');
var Radio = require('../../common/radio');
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

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            optionSelected: 0,
            roleList: [],
            roleId: this.props.data.roleId || 0,
            targetUserId: this.props.data.userId || 0
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
            roleList: result.data,
            optionSelected: this.getOptionSelected()
        });
    },
    getOptionSelected: function(){
        var result = roleStore.getState();
        var roleList = result.data;
        var optionSelected = 0;
        for (var i = 0; i < roleList.length; i++) {
            (roleList[i].role == this.state.roleId) && (optionSelected = i)
        };
        return optionSelected;
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
            util.toast('修改角色成功');
            if (this._timeout) {
                this.clearTimeout(this._timeout);
            };
            this._timeout = this.setTimeout(()=>{
                Actions.pop();
            },2000);

        };
    },
    onSelect: function(index){
        this.setState({
            roleId: this.state.roleList[index].role
        });
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
        return(
            <Radio.Option color="gray" selectedColor="#008BEF" key={item.name}>
                <View style={{ paddingTop: 7, paddingLeft: 16, paddingRight: 16 }}>
                    <Text style={{fontSize: 18}}>
                        { item.name }
                    </Text>
                    <Text style={{fontSize: 14,color: 'gray'}}>
                        { item.desc }
                    </Text>
                </View>
            </Radio.Option>
            );
    },
    renderItems: function(list){
        var self = this;
        var items = list.map(function(item, index){
            return self.renderItem(item);
        });
        return(
            <Radio onSelect={this.onSelect}
            defaultSelect={this.state.optionSelected}>
                {items}
            </Radio>
            );
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '设置角色'}}
                    leftButton={<BlueBackButton />}
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
        paddingTop: 16,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'transparent',
    }
});