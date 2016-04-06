'use strict';
import React, {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicatorIOS,
    StyleSheet
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import moment from 'moment'
var TimerMixin = require('react-timer-mixin');

// var RecordsList = require('../detail/recordsList');

var memberListAction = require('../../../actions/member/memberListAction');
var memberListStore = require('../../../stores/member/memberListStore');
var util = require('../../../common/util');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var contactsStyle = require('../../../styles/contact/contactsItem');

var BlueBackButton = require('../../../common/blueBackButton');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        var data = (!!this.props.data && this.props.data.length > 0) ? this.props.data : [];
        return {
            dataSource: ds.cloneWithRows(data)
        }
    },
    componentDidMount: function(){
        // this.unlisten = memberListStore.listen(this.onChange);
        // if (this._timeout) {
        //     this.clearTimeout(this._timeout)
        // };
        // this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        // this.unlisten();
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

    renderAvatar: function(data){
        if (!data) {
            return(<View style={contactsStyle.contactsItemCircle}/>);
        };
        if (data.avatar) {
            return(
                <Image
                  style={contactsStyle.contactsItemCircle}
                  source={{uri: data.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: data.bgColor
            }
            return(
                <View style={[contactsStyle.contactsItemCircle, circleBackground]}>
                    <Text style={contactsStyle.contactsItemTitle}>{data.simpleUserName}</Text>
                </View>
                )
        }
    },
    renderRow: function(data){
        return(
            <TouchableHighlight
                underlayColor='#eee'>
                <View style={contactsStyle.contactsItem}>
                    {this.renderAvatar(data.userVO)}
                    <View style={contactsStyle.contactsItemFlexWrapper}>
                        <Text style={[contactsStyle.contactsItemDetail, {paddingTop: 0}]}
                        numberOfLines={1}>
                            {data.userVO.userName}
                        </Text>
                        <Text style={[contactsStyle.contactsItemDetail, commonStyle.textGray]}
                        numberOfLines={1}>
                            {moment(data.date).format('YYYY-MM-DD hh:mm')}
                        </Text>
                    </View>
                    <Text style={[contactsStyle.contactRightText, contactsStyle.recordText]}
                    numberOfLines={1}>
                        +{data.count}
                    </Text>
                </View>
            </TouchableHighlight>
            );
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor={'#f9f9f9'}
                title={{title: this.props.title}}
                leftButton={<BlueBackButton />} />
            );
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ListView
                  style={contactsStyle.scrollView}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow} />
            </View>
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
    }
});