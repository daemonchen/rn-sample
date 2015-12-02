'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');
var ContactGroup = require('./group');

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
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            target: this.props.route.target,
            dataSource: ds,
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
            dataSource: this.state.dataSource.cloneWithRows(result.data)
        });
    },
    goCreateGroup: function(){
        _topNavigator.push({
            title: this.props.route.title,
            component: tabViewSample,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })

    },
    renderAvatar: function(data){
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
        console.log('data:', data);
        // { bgColor: '#b2cee6',
        //   bgColorId: 9,
        //   avatar: null,
        //   userId: 4,
        //   userName: '大白二货',
        //   simpleUserName: '二货',
        //   pinyin: 'DABAIERHUO',
        //   group: 1,
        //   mobiles: [ '15071414335' ] }
        if (data.avatar) {};
        return(
            <TouchableOpacity style={contactsStyle.contactsItem}>
                {this.renderAvatar(data)}
                <Text style={contactsStyle.contactsItemDetail}>{data.userName}</Text>
            </TouchableOpacity>
            );
    },
    _handleScroll: function(){},
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: this.props.route.title }} />
                <ScrollView style={commonStyle.container}
                contentOffset={{y: 44}}
                contentInset={{bottom: 40}}
                automaticallyAdjustContentInsets={false}
                onScroll={this._handleScroll}>
                    <SearchBar
                        placeholder='Search'
                        textFieldBackgroundColor='#fff'
                        barTintColor='#bdbdbd'
                        tintColor='#333' />
                    <ContactGroup
                    style={styles.contactGroup} />
                    <View>
                        <Text style={[commonStyle.blue, commonStyle.title]}>
                            常用联系人
                        </Text>
                    </View>
                    <ListView
                      style={contactsStyle.scrollView}
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow} />
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