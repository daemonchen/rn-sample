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
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');

var Task = require('./task/task');
var OrderDetailSegmentControl = require('./components/orderDetailSegmentControl');
var OrderSettings = require('./orderSettings');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            orderStatus: 0
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
    doCreate: function(index){
        console.log(index);
        // switch(index){
        //     case 0:
        //         this.setState({
        //             orderStatus: index
        //         })
        //         return this.doPush(OrderSettings);
        //     case 1:
        //         this.setState({
        //             orderStatus: index
        //         })
        //         return this.doPush(OrderTemplates);
        //     case 2:
        //         this.setState({
        //             orderStatus: index
        //         })
        //         return this.doPush(OrderTemplates);
        //     default:
        //         this.setState({
        //             orderStatus: 0
        //         })
        //         return this.doPush(OrderSettings);
        // }
    },
    _pressCreateButton: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 3,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
                self.doCreate(buttonIndex)
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
        // return{
        //     title: '+',
        //     handler:() =>
        //         _navigator.pop()
        // }
    },
    onPressTaskRow: function(rowData, sectionID){
        console.log('---rowData', rowData);
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: this.props.route.title, }}
                    leftButton={this.leftButtonConfig()}
                    rightButton={this.rightButtonConfig()} />
                <View style={styles.main}>
                    <OrderDetailSegmentControl />
                    <Task
                    onPressRow={this.onPressTaskRow}/>
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