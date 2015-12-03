'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var UIImagePickerManager = require('NativeModules').UIImagePickerManager;
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    ActionSheetIOS,
    TouchableOpacity,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');

var TaskList = require('./task/taskList');
var TaskDetail = require('./task/taskDetail');
var TaskSettings = require('./task/taskSettings');
var AttachList = require('./attach/attachList');
var AttachDetail = require('./attach/attachDetail');
var OrderDetailSegmentControl = require('./components/orderDetailSegmentControl');
var OrderSettings = require('./orderSettings');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            tabIndex: 0,
            images: []
        }
    },
    componentDidMount: function(){
        // this.setState({
        //     tabIndex: 0
        // });
        // contactAction.getList();
        // this.unlisten = contactStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        // this.unlisten();
    },
    leftButtonConfig:function() {
        return {
            title: '<',
            handler:() =>
                _navigator.pop()
        }
    },
    _pressSettingButton: function(){
        _topNavigator.push({
            component: OrderSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    createTask: function(){
        _topNavigator.push({
            component: TaskSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    createMember: function(){
        console.log('---create new member for this order');
    },
    onActionSelect: function(index){
        switch(index){
            case 0:
                return this.createTask();
            case 1:
                return this.createMember();
            case 2:
                return this.showCameraRoll();
            default:
                return
        }
    },
    _pressCreateButton: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 3,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                self.onActionSelect(buttonIndex)
              // self.setState({ clicked: self.actionList[buttonIndex] });
            });
    },
    actionList: ['新建任务','添加成员','上传附件','取消'],
    rightButtonConfig: function(){
        var self = this;
        return(
            <View style={{width: 72,flexDirection:'row',alignItems:'flex-end'}}>
                <TouchableOpacity onPress={this._pressCreateButton}>
                    <Image source={require('../../images/Setting.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._pressSettingButton}
                style={{marginLeft:8}}>
                    <Image source={require('../../images/Setting.png')} />
                </TouchableOpacity>
            </View>
            );
    },
    onPressTaskRow: function(rowData, sectionID){
        _topNavigator.push({
            title: rowData.name,
            component: TaskDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    onPressCircle: function(rowData, sectionID){
        console.log('todo: update task list stuff');
    },
    onPressAttachRow: function(rowData,sectionID){
        _topNavigator.push({
            title: rowData.name,
            component: AttachDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    fetchCameraParams:{
        first: 5,
        groupTypes: 'All'
    },
    showCameraRoll: function(){
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
    onAttachEmptyButtonPress: function(){
        this.showCameraRoll();
    },
    onSegmentChange: function(event){
        this.setState({
            tabIndex: event.nativeEvent.selectedSegmentIndex
        })
    },
    renderTabContent: function(){
        switch(this.state.tabIndex){
            case 0:
                return(
                    <TaskList
                    events={{
                        onPressRow: this.onPressTaskRow,
                        onPressCircle: this.onPressCircle
                    }} />
                )
            case 1:
                return(
                    <TaskList
                    events={{
                        onPressRow: this.onPressTaskRow,
                        onPressCircle: this.onPressCircle
                    }} />
                )
            case 2:
                return(
                    <TaskList
                    onPressRow={this.onPressTaskRow}/>
                )
            case 3:
                return(
                    <AttachList
                    onPressRow={this.onPressAttachRow}
                    onEmptyButtonPress={this.onAttachEmptyButtonPress}/>
                )
            default:
                return(
                    <View />
                )
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: this.props.route.title, }}
                    leftButton={this.leftButtonConfig()}
                    rightButton={this.rightButtonConfig()} />
                <View style={styles.main}>
                    <OrderDetailSegmentControl
                    onSegmentChange={this.onSegmentChange}/>
                    {this.renderTabContent()}
                </View>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main: {
        flex: 1
    }
});