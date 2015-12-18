'use strict';
/*
    add attach from task settings
*/
var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var SearchBar = require('react-native-search-bar');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var attachAction = require('../../../actions/attach/attachAction');
var commonStyle = require('../../../styles/commonStyle');
var util = require('../../../common/util');
var appConstants = require('../../../constants/appConstants');

var BlueBackButton = require('../../../common/blueBackButton');
var RightAddButton = require('../../../common/rightAddButton');

var AttachList = require('./attachList');
var AttachDetail = require('./attachDetail');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            taskId: this.props.route.data.id
        }
    },
    doAddPhoto: function(){
        this.onEmptyButtonPress();
    },
    onEmptyButtonPress: function(){
        var params = {};
        if (this.state.orderStatus == 1) {
            params = {
                hostType: 2
            }
        }else{
            params = {
                hostId: this.state.taskId,
                hostType: 2
            }
        }
        util.showPhotoPicker({
            title: ''
        }, (response)=>{
            var name = response.uri.substring(response.uri.lastIndexOf('/') + 1)
            var uri = response.uri.replace('file://', '');
            var fileObj = Object.assign({
                count:1,
                fileOrgName: name,
                uri: uri
            }, params);
            attachAction.create(fileObj);
        });
    },
    _onPressRow: function(rowData, sectionID){
        _topNavigator.push({
            title: rowData.name,
            data: rowData,
            component: AttachDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    renderNavigationBar: function(){
        var rights = appConstants.userRights.rights;
        var targetRights = 512;
        if ((rights & targetRights) == targetRights){
            return(
                <NavigationBar
                    title={{ title: '附件' }}
                    leftButton={<BlueBackButton navigator={_navigator}/>}
                    rightButton={<RightAddButton onPress={this.doAddPhoto} />} />
                );
        }else{
            return(
                <NavigationBar
                    title={{ title: '附件' }}
                    leftButton={<BlueBackButton navigator={_navigator}/>} />
                );
        }
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.main}>
                    <AttachList
                    data={this.props.route.data}
                    hostType={2}
                    onPressRow={this._onPressRow}
                    onEmptyButtonPress={this.onEmptyButtonPress}/>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    main:{
        flex:1
    }
});