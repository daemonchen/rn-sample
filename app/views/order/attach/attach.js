'use strict';
/*
    add attach from order settings
*/
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
    CameraRoll,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

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
    storeImages: function(data) {
        var assets = data.edges;
        var images = assets.map( asset => asset.node.image );
        this.setState({
            images: this.state.images.concat(images),
        });
    },
    fetchAlbumParams:{
        first: 5,
        groupTypes: 'Album'
    },
    fetchCameraParams:{
        first: 5,
        groupTypes: 'PhotoStream'
    },
    logImageError: function(err) {
        console.log(err);
    },
    showCameraRoll: function(index){
        switch(index){
            case 0:
                return CameraRoll.getPhotos(this.fetchCameraParams, this.storeImages, this.logImageError);
            case 1:
                return CameraRoll.getPhotos(this.fetchAlbumParams, this.storeImages, this.logImageError);
            default:
                return CameraRoll.getPhotos(this.fetchAlbumParams, this.storeImages, this.logImageError);
        }
    },
    showActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 2,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                self.showCameraRoll(buttonIndex)
              // self.setState({ clicked: self.actionList[buttonIndex] });
            });
    },
    actionList: ['拍摄上传','从相册上传','取消'],
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
                self.showActionSheet()
        }
    },
    onEmptyButtonPress: function(){
        this.showActionSheet();
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