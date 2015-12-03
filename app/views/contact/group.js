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

module.exports = React.createClass({
    getInitialState: function(){
        return {}
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
    render: function(){
        var circleBackground = {
            backgroundColor: '#ff7300'
        }
        return(
            <View style={[commonStyle.container, this.props.style]}>
                <ScrollView
                  style={contactsStyle.scrollView}>
                    <TouchableOpacity style={contactsStyle.contactsItem}>
                        <View style={[contactsStyle.contactsItemCircle, circleBackground]}>
                            <Text style={contactsStyle.contactsItemTitle}>架构</Text>
                        </View>
                        <Text style={contactsStyle.contactsItemDetail}>组织架构</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={contactsStyle.contactsItem}
                    onPress={this.props.goCustomerList}>
                        <View style={[contactsStyle.contactsItemCircle, circleBackground]}>
                            <Text style={contactsStyle.contactsItemTitle}>客户</Text>
                        </View>
                        <Text style={contactsStyle.contactsItemDetail}>客户</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={contactsStyle.contactsItem}
                    onPress={this.openAddress} >
                        <View style={[contactsStyle.contactsItemCircle, circleBackground]}>
                            <Text style={contactsStyle.contactsItemTitle}>手机</Text>
                        </View>
                        <Text style={contactsStyle.contactsItemDetail}>手机通讯录</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            );
    }
});