'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var SearchBar = require('react-native-search-bar');
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;
// rowdata: { bgColor: '#b2cee6',
        //   bgColorId: 9,
        //   avatar: null,
        //   userId: 4,
        //   userName: '大白二货',
        //   simpleUserName: '二货',
        //   pinyin: 'DABAIERHUO',
        //   group: 1,
        //   mobiles: [ '15071414335' ] }
var contactsStyle = require('../../styles/contact/contactsItem');
var commonStyle = require('../../styles/commonStyle');

module.exports = React.createClass({
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
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
    render: function(){
        return(
            <ListView
              style={contactsStyle.scrollView}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              contentContainerStyle={{paddingBottom: 40}} />
            );
    }
});