'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    ActionSheetIOS,
    TouchableOpacity,
    CameraRoll,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');

var TaskList = require('./task/taskList');
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
            tabIndex: 0
        }
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
        console.log('----create new task');
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
        console.log('---rowData', rowData);
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
    logImageError: function(err) {
        console.log(err);
    },
    showCameraRoll: function(){
        CameraRoll.getPhotos(this.fetchCameraParams, this.storeImages, this.logImageError);
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
                    onPressRow={this.onPressTaskRow}/>
                )
            case 1:
                return(
                    <TaskList
                    onPressRow={this.onPressTaskRow}/>
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
                    <TaskList
                    onPressRow={this.onPressTaskRow}/>
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