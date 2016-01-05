'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
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
var commonStyle = require('../../styles/commonStyle');
var util = require('../../common/util');

var taskListStore = require('../../stores/task/taskListStore');

var Home =  React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            tabIndex: 0
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    handleUpdate: function(result){
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
    },
    onChange: function() {
        var result = taskListStore.getState();
        switch(result.type){
            case 'update':
                return this.handleUpdate(result);
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
        Actions.orderSettings({
            title: '新建订单',
            data: {orderStatus: 1}
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
        Actions.taskDetailForWorkbench({
            title: rowData.title,
            data: rowData.id
        });
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
        // var rights = appConstants.userRights.rights;
        // var targetRights = 2;
        // if ((rights & targetRights) == targetRights) {
        //     return(
        //         <NavigationBar
        //             title={{ title: '工作台' }}
        //             rightButton={<RightAddButton onPress={this.showActionSheet} />} />
        //         );
        // }else{
        // }
        return(
            <NavigationBar
                title={{ title: '工作台' }} />
            );
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.main}>
                    <HomeSegmentControl
                    onSegmentChange={this.onSegmentChange} />
                    {this.renderTabContent()}
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    main:{
        flex:1
    }
});

module.exports = Home;