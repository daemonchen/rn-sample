'use strict';

import React, {
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} from 'react-native'

import NavigationBar from '../../../common/react-native-navbar/index';
import moment from 'moment'
var SearchBar = require('react-native-search-bar');


var contactsStyle = require('../../../styles/contact/contactsItem');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        var data = (!!this.props.data && this.props.data.length > 0) ? this.props.data.slice(0,2) : [];
        return {
            dataSource: ds.cloneWithRows(data)
        }
    },
    componentWillReceiveProps: function(nextProps){
        var data = (!!nextProps.data && nextProps.data.length > 0) ? nextProps.data.slice(0,2) : [];

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(data)
        });
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
    renderEmptyRow: function(){
        return (
            <View />
        )
    },
    render: function(){
        if (!this.props.data || this.props.data.length == 0) {
            return this.renderEmptyRow();
        };
        return(
            <View>
                <View style={commonStyle.settingItemWrapper}>
                    <View style={[commonStyle.settingItem]}>
                        <Text
                        numberOfLines={3}
                        style={[commonStyle.commonTitle, commonStyle.textGray,{flex: 1}]}>
                            进度记录
                        </Text>
                    </View>
                </View>
                <ListView
                  style={contactsStyle.scrollView}
                  dataSource={this.state.dataSource}
                  renderRow={this.renderRow} />
            </View>
            );
    }
});