'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Navigator,
    ActionSheetIOS,
    StyleSheet
} = React;
var HomeSegmentControl = require('./homeSegmentControl');
var HomeList = require('./homeList');
var OrderSettings = require('../order/orderSettings');
// var OrderDetail = require('../order/orderDetail');
var TaskDetail = require('../order/task/taskDetailForWorkbench');

var RightAddButton = require('../../common/rightAddButton');

var appConstants = require('../../constants/appConstants');

var _navigator, _topNavigator = null;

var Home =  React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            tabIndex: 0
        }
    },
    showActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 1,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
              self.onSelectActionSheet(buttonIndex);
            });
    },
    actionList: ['新建订单','取消'],
    doPushOrderSetting: function(){
        _topNavigator.push({
            title: '新建订单',
            data: {orderStatus: 1},
            component: OrderSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    onSelectActionSheet: function(index){
        switch(index){
            case 0:
                return this.doPushOrderSetting();
            default :
                return;
        }
    },
    onPressTaskRow: function(rowData, sectionID){
        //TODO: judge if this is task row or header row
        // _topNavigator.push({
        //     title: rowData.title,
        //     data: rowData.orderId,
        //     component: OrderDetail,
        //     sceneConfig: Navigator.SceneConfigs.FloatFromRight,
        //     topNavigator: _topNavigator
        // })
        _topNavigator.push({
            title: rowData.title,
            data: rowData.id,
            component: TaskDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })

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
                    <HomeList
                    onPressRow={this.onPressTaskRow}
                    status={0} />
                )
            case 1:
                return(
                    <HomeList
                    onPressRow={this.onPressTaskRow}
                    status={1} />
                )
        }
    },
    renderNavigationBar: function(){
        var rights = appConstants.userRights.rights;
        var targetRights = appConstants.userRights.rightsMap['2'];
        if (rights ^ targetRights == rights) {
            return(
                <NavigationBar
                    title={{ title: '工作台' }}
                    rightButton={<RightAddButton onPress={this.showActionSheet} />} />
                );
        }else{
            return(
                <NavigationBar
                    title={{ title: '工作台' }} />
                );
        }
    },
    render:function(){
        return (
            <View style={styles.container}>
                <View style={styles.main}>
                    {this.renderNavigationBar()}
                    <HomeSegmentControl
                    onSegmentChange={this.onSegmentChange} />
                    {this.renderTabContent()}
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    main:{
        flex:1
    }
});

module.exports = Home;