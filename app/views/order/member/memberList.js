'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var TimerMixin = require('react-timer-mixin');
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

var ContactList = require('../../contact/contactList');

var memberListAction = require('../../../actions/member/memberListAction');
var memberListStore = require('../../../stores/member/memberListStore');
var util = require('../../../common/util');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var contactsStyle = require('../../../styles/contact/contactsItem');

module.exports = React.createClass({
    mixins: [TimerMixin],
    pageNum: 1,
    getInitialState: function(){
        return {
            pageSize: 20,
            loaded : false,
            listData: []
        }
    },
    componentDidMount: function(){
        this.unlisten = memberListStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    handleGet: function(result){
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        this.setState({
            listData: result.data,
            loaded: true
        });
    },
    onChange: function() {
        var result = memberListStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
        }
    },
    fetchData: function() {
        this.pageNum = 1;
        memberListAction.getList({
            orderId: this.props.data.orderId,
            pageNum: this.pageNum,
            pageSize: this.state.pageSize
        });
    },
    render: function() {
        if (!this.state.loaded) {
            return this.renderLoadingView();
        }
        return this.renderListView();
    },
    onPressRow: function(data){
        this.props.onPressRow(data);
    },
    renderListView: function(){
        return (
            <ContactList
                style={contactsStyle.scrollView}
                data={this.state.listData}
                onPressRow={this.onPressRow} />
            )
    },
    renderLoadingView: function(){
        return (
            <View style={commonStyle.header}>
                <Text style={commonStyle.headerText}>User List</Text>
                <View style={commonStyle.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[commonStyle.activityIndicator, {height: 80}]}
                        size="large" />
                </View>
            </View>
        );
    }
});