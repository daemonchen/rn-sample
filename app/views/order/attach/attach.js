'use strict';
/*
    add attach from order settings
*/
var React = require('react-native');
var NavigationBar = require('react-native-navbar');
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

var AttachList = require('./attachList');
var AttachDetail = require('./attachDetail');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            images: []
        }
    },
    leftButtonConfig: function(){
        return{
            title: '<',
            handler:function(){
                _topNavigator.pop();
            }
        }
    },
    rightButtonConfig:function(){
        var self = this;
        return {
            title: '+',
            handler:() =>
                self.onEmptyButtonPress()
        }
    },
    onEmptyButtonPress: function(){
        util.showPhotoPicker({
            title: ''
        }, (response)=>{
            var name = response.uri.substring(response.uri.lastIndexOf('/') + 1)
            attachAction.create([{
                base64: response.data,
                fileName: name}]);
        });
    },
    _onPressRow: function(rowData, sectionID){
        _topNavigator.push({
            title: rowData.name,
            component: AttachDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '添加附件', }}
                    leftButton={this.leftButtonConfig()}
                    rightButton={this.rightButtonConfig()} />
                <View style={styles.main}>
                    <AttachList
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