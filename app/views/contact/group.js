'use strict';

var React = require('react-native');

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
    render: function(){
        var circleBackground = {
            backgroundColor: '#ff7300'
        }
        return(
            <View style={[commonStyle.container, this.props.style]}>
                <ScrollView
                  style={contactsStyle.scrollView}>
                    <TouchableOpacity style={contactsStyle.contactsItem}>
                        <View style={[contactsStyle.contactsItemCircle, circleBackground]}></View>
                        <Image style={contactsStyle.contactsItemIcon} source={require('../../images/Send.png')} />
                        <Text style={contactsStyle.contactsItemTitle}>组织架构</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={contactsStyle.contactsItem}>
                        <View style={[contactsStyle.contactsItemCircle, circleBackground]}></View>
                        <Image style={contactsStyle.contactsItemIcon} source={require('../../images/Send.png')} />
                        <Text style={contactsStyle.contactsItemTitle}>客户</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={contactsStyle.contactsItem}>
                        <View style={[contactsStyle.contactsItemCircle, circleBackground]}></View>
                        <Image style={contactsStyle.contactsItemIcon} source={require('../../images/Send.png')} />
                        <Text style={contactsStyle.contactsItemTitle}>手机通讯录</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
            );
    }
});