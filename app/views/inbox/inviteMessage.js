'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var inboxAction = require('../../actions/inbox/inboxAction');
var inboxStore = require('../../stores/inbox/inboxStore');
var authTokenAction = require('../../actions/user/authTokenAction');

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');

var InviteMessageItem = require('./inviteMessageItem');
var BlueBackButton = require('../../common/blueBackButton');

var util = require('../../common/util');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({
            // rowHasChanged: (r1, r2) => r1 !== r2
            rowHasChanged: (r1, r2) => true////为了在swipe的时候刷新列表
        });
        return {
            loaded : false,
            list: [],
            dataSource: ds
        }
    },
    componentWillMount: function(){
        this.getInvite();
        this.unlisten = inboxStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    getInvite: function(){
        inboxAction.getInviteList();
    },
    handleGetInviteList: function(result){
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            this.setState({
               loaded: true,
               list: []
            })
            return;
       }
       this.setState({
           dataSource : this.state.dataSource.cloneWithRows(result.data || []),
           list: result.data || [],
           loaded     : true,
           total: result.total
       });
    },
    handleAgree: function(data){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            authTokenAction.updateToken();
            // this.getInvite();
        },350);
    },
    onChange: function(){
        var result = inboxStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'getInviteList':
                return this.handleGetInviteList(result);
            case 'agreeInvite':
                return this.handleAgree(result);
        }
    },
    onAgree: function(data){
        inboxAction.agreeInvite({
            id: data.id
        });
    },
    renderRow: function(data) {
        // if (!this.state.data) {
        //     return(
        //         <View />
        //         );
        // };
        console.log('------invite row data', data);
        return (
            <InviteMessageItem data={data}
            onAgree={this.onAgree} />
            )
    },
    renderLoadingView: function(){
        return (
            <View style={commonStyle.header}>
                <Text style={commonStyle.headerText}>User List</Text>
                <View style={commonStyle.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[commonStyle.activityIndicator]}
                        size="small" />
                </View>
            </View>
        );
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        暂无邀请消息
                </Text>
            </View>
        )
    },
    renderListView: function(){
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        if (!this.state.list || this.state.list.length == 0) {
            return this.renderEmptyRow();
        };
        return(
            <ListView
                style={contactsStyle.scrollView}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                contentContainerStyle={{paddingBottom: 40}} />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '系统消息' }}
                    leftButton={<BlueBackButton />} />
                <ScrollView style={commonStyle.container}
                keyboardDismissMode={'interactive'}
                automaticallyAdjustContentInsets={false} >
                    {this.renderListView()}
                </ScrollView>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main:{
        flex:1
    }
});