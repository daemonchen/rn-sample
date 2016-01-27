'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
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

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');

var ContactGroup = require('./group');
var ContactList = require('./contactList');

var BlueBackButton = require('../../common/blueBackButton');

var contactAction = require('../../actions/contact/contactAction');
var contactStore = require('../../stores/contact/contactStore');

var util = require('../../common/util');
/*
target: 表示从哪里打开通讯录 enum
{
    1: 'createTask',
    2: 'createOrder'
    3: 'normal'
}
*/
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            target: this.props.target || 3,
            listData: [],
        }
    },
    componentWillMount: function(){
        this.unlisten = contactStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    fetchData: function(){
        contactAction.getList();
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
    onPressRow: function(data){
        if (this.state.target == 3) {
            Actions.contactDetail({
                title: data.userName,
                data: data
            });
            return;
        }else{
            this.props.onPressContactRow(data);
            Actions.pop();
        }
    },
    goCustomerList: function(){
        Actions.customerList({
            title: '客户',
            target: this.state.target
        });
    },
    goCompanyMemberList: function(){
        Actions.companyMemberList({
            title: '组织架构',
            target: this.state.target
        });
    },
    goCompanyWelcom: function(){
        Actions.companyWelcome({
            title: '新建或加入工厂'
        });
    },
    renderNavigationBar: function(){
        if (this.state.target == 3) {
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }} />
                );

        }else{
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    leftButton={<BlueBackButton />} />
                );
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}

                automaticallyAdjustContentInsets={false} >

                    <ContactGroup
                    style={styles.contactGroup}
                    goCustomerList={this.goCustomerList}
                    goCompanyMemberList={this.goCompanyMemberList}
                    goCompanyWelcom={this.goCompanyWelcom} />
                    <View>
                        <Text style={[commonStyle.blue, commonStyle.title]}>
                            常用联系人
                        </Text>
                    </View>
                    <ContactList
                        style={contactsStyle.scrollView}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    contactGroup: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    }
});