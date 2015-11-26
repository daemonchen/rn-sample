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
            dataSource: ds.cloneWithRows(['row 1', 'row 2','row 2','row 2','row 2','row 2','row 2']),
        }
    },
    rightButtonConfig: function(){
        return {
            title: '+',
            handler:() =>
                _topNavigator.push({
                    title: this.props.route.title,
                    component: tabViewSample,
                    sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                    topNavigator: _topNavigator
                })
        }
    },
    renderRow: function(data){
        var circleBackground = {
            backgroundColor: '#ff7300'
        }
        return(
            <TouchableOpacity style={contactsStyle.contactsItem}>
                <View style={[contactsStyle.contactsItemCircle, circleBackground]}></View>
                <Image style={contactsStyle.contactsItemIcon} source={require('../../images/Send.png')} />
                <Text style={contactsStyle.contactsItemTitle}>大白工厂{data}</Text>
            </TouchableOpacity>
            );
    },
    _handleScroll: function(){},
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: this.props.route.title }}
                    rightButton={this.rightButtonConfig()} />
                <ScrollView style={commonStyle.container}
                contentOffset={{y: 44}}
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