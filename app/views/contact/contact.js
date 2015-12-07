'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
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

var ContactGroup = require('./group');
var ContactDetail = require('./contactDetail');
var ContactList = require('./contactList');
var CustomerList = require('./customerList');
var BlueBackButton = require('../../common/blueBackButton');

var contactAction = require('../../actions/contact/contactAction');
var contactStore = require('../../stores/contact/contactStore');

var util = require('../../common/util');
/*
target: 表示从哪里打开通讯录 enum
{
    0: 'createOrder',
    1: 'createTask',
    2: 'normal'
}
*/
module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            target: this.props.route.target,
            listData: [],
        }
    },
    componentDidMount: function(){
        contactAction.getList();
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
        if (this.state.target == 2) {
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
    goCustomerList: function(){
        _topNavigator.push({
            title: '客户',
            target: this.state.target,
            component: CustomerList,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    renderNavigationBar: function(){
        if (this.state.target == 2) {
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }} />
                );

        }else{
            return(
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    leftButton={<BlueBackButton navigator={_navigator}/>} />
                );
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}

                automaticallyAdjustContentInsets={false} >

                    <ContactGroup
                    style={styles.contactGroup}
                    goCustomerList={this.goCustomerList} />
                    <View>
                        <Text style={[commonStyle.blue, commonStyle.title]}>
                            常用联系人
                        </Text>
                    </View>
                    <ContactList
                        style={contactsStyle.scrollView}
                        data={this.state.listData}
                        onPressRow={this.onPressRow} />
                </ScrollView>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    contactGroup: {
        borderBottomWidth: 1 / React.PixelRatio.get(),
        borderBottomColor: '#bdbdbd'
    }
});