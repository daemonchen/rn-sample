'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var SearchBar = require('react-native-search-bar');
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

var contactsStyle = require('../../styles/contact/contactsItem');
var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');
/*
target: 表示从哪里打开联系人列表 enum
{
    1: 'normal',
    2: '评论的时候@某人',
}
*/
module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        return {
            dataSource: ds.cloneWithRows(this.props.data),
            target: this.props.target || 1
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
    renderCheckIcon: function(data){
        if (this.state.target == 1) {//察看联系人
            return(
                <View />
                );
        };
        if (this.state.target == 2) {//@某人
            var circleImage = (!!data.isCheck) ? require('../../images/task/Check_box_selected.png') : require('../../images/task/Check_box.png');
            return(
            <View style={[contactsStyle.contactsItemCircle, {marginRight: 10}]}>
                <Image source={circleImage} style={styles.checkIcon24}/>
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
                    {this.renderCheckIcon(data)}
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
                <Image source={require('../../images/empty/no_person_gray.png')} />
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
              contentContainerStyle={{paddingBottom: 40}} />
            );
    }
});