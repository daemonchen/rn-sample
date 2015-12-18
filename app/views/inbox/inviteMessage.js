'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
import NavigationBar from 'react-native-navbar'
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var inboxAction = require('../../actions/inbox/inboxAction');
var inboxStore = require('../../stores/inbox/inboxStore');

var commonStyle = require('../../styles/commonStyle');
var InviteMessageItem = require('./inviteMessageItem');
var BlueBackButton = require('../../common/blueBackButton');

var util = require('../../common/util');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            data: null
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
        inboxAction.getInvite({
            id: this.props.route.data.extra.inviteId
        });
    },
    renderPage: function(data){
        this.setState({
            data: data.data
        })
    },
    handleAgree: function(data){
        this.state.data['agree'] = data.data
        this.setState({
            data: this.state.data
        });
    },
    onChange: function(){
        var result = inboxStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'getInvite':
                return this.renderPage(result);
            case 'agreeInvite':
                return this.handleAgree(result);
        }
    },
    onAgree: function(data){
        inboxAction.agreeInvite({
            id: data.id
        });
    },
    renderContent: function() {
        if (!this.state.data) {
            return(
                <View />
                );
        };
        return (
            <InviteMessageItem data={this.state.data}
            onAgree={this.onAgree} />
            )
    },

    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '系统消息' }}
                    leftButton={<BlueBackButton navigator={_navigator}/>} />
                <View style={styles.main}>
                    {this.renderContent()}
                </View>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main:{
        flex:1
    }
});