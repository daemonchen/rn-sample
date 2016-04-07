'use strict';

var React = require('react-native');
import NavigationBar from '../../../common/react-native-navbar/index';
var SearchBar = require('react-native-search-bar');
var Swipeout = require('react-native-swipeout');
var Actions = require('react-native-router-flux').Actions;
var {
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var contactsStyle = require('../../../styles/contact/contactsItem');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var appConstants = require('../../../constants/appConstants');

module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        return {
            scrollEnabled: true,
            dataSource: ds.cloneWithRows(this.props.data)
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.data)
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
    onPressRow: function(data){
        Actions.contactDetail({
            title: data.userName,
            data: data
        });
    },
    _handleSwipeout: function(rowData){
        !!this.props._handleSwipeout && this.props._handleSwipeout(rowData);
    },
    _allowScroll: function(scrollEnabled) {
       this.setState({ scrollEnabled: scrollEnabled })
    },
    onDelete: function(rowData){
        !!this.props.onDelete && this.props.onDelete(rowData)
    },
    renderRow: function(data){
        var swipeoutBtns = [
          {
            text: '删除',
            type: 'delete',
            onPress: ()=>{this.onDelete(data)}
            // backgroundColor: ''
          }
        ]
        var rights = appConstants.userRights.rights;
        var targetRights = 64;
        if ((rights & targetRights) == targetRights) {
            return(
                <Swipeout autoClose={true} right={swipeoutBtns}
                backgroundColor='transparent'
                scroll={event => this._allowScroll(event)}
                close={!data.active}
                onOpen={()=>{this._handleSwipeout(data)}}
                style={styles.swipeWrapper}>
                    <TouchableHighlight
                        onPress={()=>{this.onPressRow(data)}}
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
                </Swipeout>
                );
        }else{
            return(
                <TouchableHighlight
                    onPress={()=>{this.onPressRow(data)}}
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
        }
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        您还没有联系人
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
              contentContainerStyle={{paddingBottom: 40}}
              scrollEnabled={this.state.scrollEnabled} />
            );
    }
});