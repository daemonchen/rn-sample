'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');

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
var styles = require('../../styles/contact/contactsItem');


var LeftCloseButton = require('../../common/leftCloseButton');
var NavTitleWithLogo = require('../../common/navTitleWithLogo');

var contactAction = require('../../actions/contact/contactAction');
var contactStore = require('../../stores/contact/contactStore');

var util = require('../../common/util');
var Button = require('../../common/button.js');
var appConstants = require('../../constants/appConstants');

module.exports = React.createClass({
    getInitialState: function(){
        return {}
    },
    componentDidMount: function(){
    },
    componentWillUnmount: function() {
    },

    goCreateFactory: function(){
        Actions.createFactory({
            title: '新建企业'
        });
    },
    goFactoryList: function(){
        Actions.companyList({
            title: '搜索企业'
        });
    },

    renderNavigationBar: function(){
        return(
            <NavigationBar
                title={<NavTitleWithLogo />}
                leftButton={<LeftCloseButton />} />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}
                contentContainerStyle={{alignItems: 'center'}}
                automaticallyAdjustContentInsets={false} >
                    <Text style={[styles.welcomeText, commonStyle.textDark,{marginTop: 20}]}>加入或新建企业</Text>
                    <Button
                    style={[commonStyle.blueButton, {marginTop: 100}]}
                    onPress={this.goFactoryList} >
                        加入已有企业
                    </Button>
                    <Button
                    style={[commonStyle.greenButton]}
                    onPress={this.goCreateFactory} >
                        新建企业
                    </Button>
                </ScrollView>
            </View>
            );
    }
});
