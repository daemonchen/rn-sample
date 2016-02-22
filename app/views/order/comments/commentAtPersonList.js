'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');

var TimerMixin = require('react-timer-mixin');
var underscore = require('underscore');
var {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var commonStyle = require('../../../styles/commonStyle');
var contactsStyle = require('../../../styles/contact/contactsItem');

var ContactList = require('../../contact/contactList');
var InviteEmployee = require('../../contact/inviteEmployee');
var Modal = require('../../../common/modal');

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var contactAction = require('../../../actions/contact/contactAction');
var contactStore = require('../../../stores/contact/contactStore');
var commentAction = require('../../../actions/comment/commentAction');

var employeeAction = require('../../../actions/employee/employeeAction');
var employeeStore = require('../../../stores/employee/employeeStore');

var util = require('../../../common/util');
var appConstants = require('../../../constants/appConstants');
/*
target: 表示从哪里打开联系人列表 enum
{
    1: 'normal',
    2: '评论的时候@某人',
}
*/
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            target: this.props.target || 1,
            atUsers: this.props.atUsers || [],
            atUserIds: this.props.atUserIds || [],
            listData: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        contactAction.getList();
        this.unlisten = contactStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = contactStore.getState();
        if (result.type != 'get') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this.mergeListData(result.data);
    },
    mergeListData: function(list){
        var users = [];
        var ids = this.state.atUserIds;
        for (var i = 0; i < list.length; i++) {
            list[i].isCheck = false;
            for (var j = 0; j < ids.length; j++) {
                if (list[i].userId == ids[j]) {
                    list[i].isCheck = true;
                    users.push(list[i]);
                };

            };

        };
        this.setState({
            listData: list,
            atUsers: users
        });
    },
    setAtUserIds: function(data){
        // console.log('setAtUserIds', data);
        var ids = this.state.atUserIds;
        if (!!data.isCheck && underscore.contains(ids, data.userId)) {//从选中状态改为为选中状态
            ids = underscore.without(ids, data.userId);
        }else{
            ids.push(data.userId);
        }
        this.setState({
            atUserIds: ids
        });
        this.mergeListData(this.state.listData);
    },
    onPressContactRow: function(data){
        this.setAtUserIds(data);
        // var ids = this.state.atUserIds;
        // ids.push(data.userId);
        // this.setState({
        //     atUserIds: ids
        // });
    },
    onPressRow: function(data){
        if (this.state.target == 1) {
            Actions.contactDetail({
                title: data.userName,
                data: data
            });
            return;
        }else{
            this.onPressContactRow(data);
        }
    },
    _pressDone: function(){
        commentAction.at({
            type: 'at',
            atUsers: this.state.atUsers
        });
        Actions.pop();
    },
    renderNavigationBar: function(){
        return(
             <NavigationBar
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />}
                rightButton={<RightDoneButton onPress={this._pressDone} />} />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}
                automaticallyAdjustContentInsets={false} >
                    <ContactList
                        style={contactsStyle.scrollView}
                        target={2}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
                <Modal ref={(ref)=>{this._modal = ref}}/>
            </View>
            );
    }
});
