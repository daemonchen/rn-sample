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
                console.log(phone);
                phone = phone.replace(/[^\d]/g, '');
                if (/^1[3|4|5|6|7|8|9][0-9]\d{8}$/.test(phone)) {
                    console.log(phone);
                }
            }
        })
    },
    renderFactoryItem: function(){
        if (!this.state.factoryName) {
            return(
                <TouchableOpacity style={contactsStyle.contactsItem}
                onPress={this.props.goCreateFactory}>
                    <Image
                        style={contactsStyle.contactsItemCircle}
                        source={require('../../images/contact/organization.png')} />
                    <Text style={contactsStyle.contactsItemDetail}>组织架构</Text>
                    <Text style={[contactsStyle.contactRightText, commonStyle.blue]}>
                        添加工厂
                    </Text>
                </TouchableOpacity>
                );
        }else{
            return(
                <TouchableOpacity style={contactsStyle.contactsItem}
                onPress={this.props.goCompanyMemberList}>
                    <Image
                        style={contactsStyle.contactsItemCircle}
                        source={require('../../images/contact/organization.png')} />
                    <Text style={contactsStyle.contactsItemDetail}>{this.state.factoryName}</Text>
                </TouchableOpacity>
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
                    <TouchableOpacity style={contactsStyle.contactsItem}
                    onPress={this.props.goCustomerList}>
                        <Image
                        style={contactsStyle.contactsItemCircle}
                        source={require('../../images/contact/Client.png')} />
                        <Text style={contactsStyle.contactsItemDetail}>客户</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={contactsStyle.contactsItem}
                    onPress={this.openAddress} >
                        <Image
                        style={contactsStyle.contactsItemCircle}
                        source={require('../../images/contact/Phone-contacts-circle.png')} />
                        <Text style={contactsStyle.contactsItemDetail}>手机通讯录</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            );
    }
});