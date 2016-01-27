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

var factoryAction = require('../../actions/factory/factoryAction');
var factoryStore = require('../../stores/factory/factoryStore');

var employeeAction = require('../../actions/employee/employeeAction');

var util = require('../../common/util');
var appConstants = require('../../constants/appConstants');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        return {
            dataSource: ds,
            listData: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = factoryStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },

    onChange: function() {
        var result = factoryStore.getState();
        if (result.type != 'get') { return; };
        console.log('-----factoryStore result', result);
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this.setState({
            listData: result.data,
            dataSource : this.state.dataSource.cloneWithRows(result.data)
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
        factoryAction.get({
            q: text
        });
    },
    onSearchButtonPress: function(e){
        console.log('-----onSearchButtonPress', e)
    },
    onCancelButtonPress: function(e){
        console.log('-----onCancelButtonPress', e)
    },
    renderSearchBar: function(){
        return(
            <View>
                <SearchBar
                    ref={(ref)=>{this.searchBar = ref}}
                    placeholder='搜索'
                    tintColor='#727272'
                    barTintColor="#fff"
                    textFieldBackgroundColor='#f2f2f2'
                    hideBackground={true}
                    onChangeText={this.onChangeText}
                    onSearchButtonPress={this.onSearchButtonPress}
                    onCancelButtonPress={this.onCancelButtonPress} />
            </View>
            );
    },
    renderRowRightBtn: function(data){
        return(
            <Text style={[contactsStyle.contactRightText, commonStyle.textGray]}
            numberOfLines={1}>
                {data.position}
            </Text>
            );
    },
    renderRow: function(data){
        return(
            <TouchableHighlight
                onPress={()=>{this.props.onPressRow(data)}}
                underlayColor='#eee'>
                <View style={contactsStyle.contactsItem}>
                    <Text style={contactsStyle.contactsItemDetail}
                    numberOfLines={1}>
                        {data.userName}
                    </Text>
                    {this.renderRowRightBtn(data)}
                </View>
            </TouchableHighlight>
            );
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        搜索工厂
                </Text>
            </View>
        )
    },
    renderListView: function(){
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
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}
                keyboardDismissMode={'interactive'}
                automaticallyAdjustContentInsets={false} >
                    {this.renderSearchBar()}
                    {this.renderListView()}
                </ScrollView>
                <Modal ref={(ref)=>{this._modal = ref}}/>
            </View>
            );
    }
});
