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
    ListView,
    TouchableOpacity,
    TouchableHighlight,
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
var employeeStore = require('../../stores/employee/employeeStore');

var util = require('../../common/util');
var Button = require('../../common/button.js');
var appConstants = require('../../constants/appConstants');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        return {
            dataSource: ds,
            list: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = factoryStore.listen(this.onChange);
        this.unlistenEmployee = employeeStore.listen(this.onEmployeeChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenEmployee();
    },

    onChange: function() {
        var result = factoryStore.getState();
        if (result.type != 'getList') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this.setState({
            list: result.data || [],
            dataSource : this.state.dataSource.cloneWithRows(result.data || [])
        });
    },
    onEmployeeChange: function(){
        var result = employeeStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'join':
                return this.handleJoin(result);
        }
    },
    handleJoin: function(result){
        var currentList = this.state.list;
        //标记已申请
        for (var i = 0; i < currentList.length; i++) {
            (currentList[i].factoryId == result.data) && (currentList[i].isSelected = true)
        };
        this.setState({
            list: currentList || [],
            dataSource : this.state.dataSource.cloneWithRows(currentList || [])
        });
    },
    onPressRow: function(data){
        employeeAction.join({
            factoryId: data.factoryId
        });
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />} />
            );
    },
    doQuery: function(text){
        if (!text) {return};
        factoryAction.getList({
            q: text
        });
    },
    onChangeText: function(text){
        var self = this;
        if (this._timeout) {this.clearTimeout(this._timeout)};
        this._timeout = this.setTimeout(function(){
            self.doQuery(text);
        }, 500);
    },
    onSearchButtonPress: function(text){
        this.doQuery(text);
    },
    onCancelButtonPress: function(e){
        console.log('-----onCancelButtonPress', e)
    },
    renderSearchBar: function(){
        return(
            <View style={{paddingHorizontal: 10}}>
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
        if (!!data.isSelected) {
            return(
                <View style={{width: 64}}>
                    <Text
                    style={[commonStyle.textGray]} >
                        已申请
                    </Text>
                </View>
                );
        };
        return(
            <View style={{width: 64}}>
                <Button
                style={[commonStyle.buttonBlueFlex]}
                onPress={()=>{this.onPressRow(data)}} >
                    申请
                </Button>
            </View>
            );
    },
    renderRow: function(data){
        return(
            <TouchableHighlight
                style={commonStyle.settingItemWrapper}
                underlayColor='#eee'
                onPress={()=>{this.onPressRow(data)}}>
                <View
                style={commonStyle.settingItem}>
                    <Text
                    style={commonStyle.settingDetail}>
                        {data.factoryName}
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
                        搜索企业
                </Text>
            </View>
        )
    },
    renderListView: function(){
        if (!this.state.list || this.state.list.length == 0) {
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
