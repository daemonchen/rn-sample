'use strict';

var React = require('react-native');
var PhonePicker = require('react-native-phone-picker');

var {
    View,
    Text,
    Navigator,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');
var appConstants = require('../../constants/appConstants');


module.exports = React.createClass({
    getInitialState: function(){
        return {
            factoryName: !!appConstants.user ? appConstants.user.factoryName : ''
        }
    },
    openAddress: function(){
        PhonePicker.select(function(phone) {
            if (phone) {
                phone = phone.replace(/[^\d]/g, '');
                if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone)) {
                    console.log(phone);
                }
            }
        })
    },
    renderCustomerItem: function(){
        var rights = appConstants.userRights.rights;
        var targetRights = 65536;
        if ((rights & targetRights) == targetRights){
            return(
                <TouchableOpacity style={contactsStyle.contactsItem}
            onPress={this.props.goCustomerList}>
                <Image
                style={contactsStyle.contactsItemCircle}
                source={require('../../images/contact/Client.png')} />
                <Text style={contactsStyle.contactsItemDetail}>客户</Text>
            </TouchableOpacity>
            )
        }else{
            return(
                <View />
                )
        }
    },
    renderFactoryItem: function(){
        if (!this.state.factoryName) {
            return(
                <TouchableHighlight
                onPress={this.props.goCreateFactory}
                underlayColor='#eee'>
                    <View style={contactsStyle.contactsItem}>
                        <Image
                            style={contactsStyle.contactsItemCircle}
                            source={require('../../images/contact/organization.png')} />
                        <Text style={contactsStyle.contactsItemDetail}>组织架构</Text>
                        <Text style={[contactsStyle.contactRightText, commonStyle.blue]}>
                            添加工厂
                        </Text>
                    </View>
                </TouchableHighlight>
                );
        }else{
            return(
                <TouchableHighlight
                onPress={this.props.goCompanyMemberList}
                underlayColor='#eee'>
                    <View style={contactsStyle.contactsItem}>
                        <Image
                            style={contactsStyle.contactsItemCircle}
                            source={require('../../images/contact/organization.png')} />
                        <Text style={contactsStyle.contactsItemDetail}>{this.state.factoryName}</Text>
                    </View>
                </TouchableHighlight>
                );
        }
    },
    render: function(){
        var circleBackground = {
            backgroundColor: '#ff7300'
        }
        return(
            <View style={[commonStyle.container, this.props.style]}>
                <ScrollView
                  style={contactsStyle.scrollView}>
                    {this.renderFactoryItem()}
                    {this.renderCustomerItem()}
                    <TouchableHighlight
                    underlayColor='#eee'
                    onPress={this.openAddress} >
                        <View style={contactsStyle.contactsItem}>
                            <Image
                            style={contactsStyle.contactsItemCircle}
                            source={require('../../images/contact/Phone-contacts-circle.png')} />
                            <Text style={contactsStyle.contactsItemDetail}>手机通讯录</Text>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
            );
    }
});