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
    showActionSheet: function(){
        var self = this;
        var options = {
          title: '添加附件', // specify null or empty string to remove the title
          cancelButtonTitle: 'Cancel',
          takePhotoButtonTitle: '拍照', // specify null or empty string to remove this button
          chooseFromLibraryButtonTitle: '选择图片', // specify null or empty string to remove this button
          maxWidth: 100,
          maxHeight: 100,
          quality: 0.2,
          allowsEditing: false, // Built in iOS functionality to resize/reposition the image
          noData: false, // Disables the base64 `data` field from being generated (greatly improves performance on large photos)
          storageOptions: { // if this key is provided, the image will get saved in the documents directory (rather than a temporary directory)
            skipBackup: true, // image will NOT be backed up to icloud
            path: 'images' // will save image at /Documents/images rather than the root
          }
        };

        UIImagePickerManager.showImagePicker(options, (didCancel, response) => {
          console.log('Response = ', response);

          if (didCancel) {
            console.log('User cancelled image picker');
          }
          else {
            if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            }
            else {
              // You can display the image using either:
              // const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
              const source = {uri: response.uri.replace('file://', ''), isStatic: true};

              this.setState({
                avatarSource: source
              });
            }
          }
        });
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