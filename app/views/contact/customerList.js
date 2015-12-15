'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var SearchBar = require('react-native-search-bar');
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Image,
    Navigator,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');
var ContactDetail = require('./contactDetail');
var ContactList = require('./contactList');
var CustomerSettings = require('./customerSettings');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');

var customerListAction = require('../../actions/contact/customerListAction');
var customerListStore = require('../../stores/contact/customerListStore');
var customerStore = require('../../stores/contact/customerStore');

var util = require('../../common/util');
/*
target: 表示从哪里打开通讯录 enum
{
    1: 'createTask',
    2: 'createOrder'
    3: 'normal'
}
*/
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            target: this.props.route.target || 3,
            listData: [],
        }
    },
    componentDidMount: function(){
        customerListAction.getList();
        this.unlisten = customerListStore.listen(this.onChange);
        this.unlistenCustomer = customerStore.listen(this.onCustomerChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenCustomer();
    },
    onCustomerChange: function(){
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            customerListAction.getList();
        },2000);
    },
    onChange: function() {
        var result = customerListStore.getState();
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
            _topNavigator.push({
                title: data.userName,
                data: data,
                component: ContactDetail,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                topNavigator: _topNavigator
            })
            return;
        }else{
            this.props.route.onPressContactRow(data);
            _topNavigator.pop();
        }
    },
    goSetting: function(){
        _navigator.push({
            title: '新建客户',
            target: 1,
            component: CustomerSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                title={{ title: this.props.route.title }}
                leftButton={<BlueBackButton navigator={_navigator}/>}
                rightButton={<RightAddButton onPress={this.goSetting} />} />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}
                automaticallyAdjustContentInsets={false} >
                    <ContactList
                        style={contactsStyle.scrollView}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
            </View>
            );
    }
});
