'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
var PhonePicker = require('react-native-phone-picker');
var TimerMixin = require('react-timer-mixin');
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
            listData: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        contactAction.getList();
        this.unlisten = contactStore.listen(this.onChange)
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
        this.setState({
            listData: result.data
        });
    },
    onPressContactRow: function(data){
        var text = this.state.comment.substring(0, this.state.comment.length - 1);
        var ids = this.state.atUserIds;
        ids.push(data.userId);
        this.setState({
            comment: text,
            atUserIds: ids
        });
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
        commentAction.at(this.state.atUserIds);
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
