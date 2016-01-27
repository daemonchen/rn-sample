'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
var PhonePicker = require('react-native-phone-picker');
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');

var ContactDetail = require('./contactDetail');
var ContactList = require('./contactList');

var Modal = require('../../common/modal');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');
var RightMoreButton = require('../../common/rightMoreButton');

var contactAction = require('../../actions/contact/contactAction');
var contactStore = require('../../stores/contact/contactStore');

var employeeAction = require('../../actions/employee/employeeAction');

var util = require('../../common/util');
var appConstants = require('../../constants/appConstants');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            target: this.props.target || 3,
            listData: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = contactStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },

    onChange: function() {
        var result = contactStore.getState();
        if (result.type != 'get') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this.setState({
            listData: result.data
        });
    },
    onPressRow: function(data){
        if (this.state.target == 3) {
            Actions.contactDetail({
                title: data.userName,
                data: data
            });
            return;
        }else{
            this.props.onPressContactRow(data);
            Actions.pop();
        }
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />} />
            );
    },
    onChangeText: function(text){
        console.log('-----onChangeText', text);
    },
    onSearchButtonPress: function(e){
        console.log('-----onSearchButtonPress', e)
    },
    onCancelButtonPress: function(e){
        console.log('-----onCancelButtonPress', e)
    },
    renderSearchBar: function(){
        return(
            <SearchBar
                ref={(ref)=>{this.searchBar = ref}}
                style={{border: 0}}
                placeholder='搜索'
                tintColor='#727272'
                barTintColor="#fff"
                textFieldBackgroundColor='#f2f2f2'
                onChangeText={this.onChangeText}
                onSearchButtonPress={this.onSearchButtonPress}
                onCancelButtonPress={this.onCancelButtonPress} />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                {this.renderSearchBar()}
                <ScrollView style={commonStyle.container}
                automaticallyAdjustContentInsets={false} >
                    <ContactList
                        style={contactsStyle.scrollView}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
                <Modal ref={(ref)=>{this._modal = ref}}/>
            </View>
            );
    }
});
