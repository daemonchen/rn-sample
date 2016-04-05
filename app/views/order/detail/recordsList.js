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

import NavigationBar from 'react-native-navbar'
var SearchBar = require('react-native-search-bar');


var contactsStyle = require('../../../styles/contact/contactsItem');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        return {
            dataSource: ds.cloneWithRows(this.props.data || [])
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.data || [])
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
                onPress={()=>{this.props.onPressRow(data)}}
                underlayColor='#eee'>
                <View style={contactsStyle.contactsItem}>
                    {this.renderAvatar(data)}
                    <Text style={contactsStyle.contactsItemDetail}
                    numberOfLines={1}>
                        {data.userName}
                    </Text>
                    <Text style={[contactsStyle.contactRightText, commonStyle.textGray]}
                    numberOfLines={1}>
                        {data.position}
                    </Text>
                </View>
            </TouchableHighlight>
            );
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Image source={require('../../../images/empty/no_client_gray.png')} />
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        暂无记录
                </Text>
            </View>
        )
    },
    render: function(){
        if (!this.props.data || this.props.data.length == 0) {
            return this.renderEmptyRow();
        };
        return(
            <ListView
              style={contactsStyle.scrollView}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              contentContainerStyle={{paddingBottom: 40}} />
            );
    }
});