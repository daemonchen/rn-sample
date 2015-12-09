'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
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
var OrderDetail = require('../order/orderDetail');

var RightAddButton = require('../../common/rightAddButton');

var _navigator, _topNavigator = null;

var Home =  React.createClass({
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
            case 1:
                return self.doPushOrderSetting();
            default :
                return;
        }
    },
    onPressTaskRow: function(rowData, sectionID){
        //TODO: judge if this is task row or header row
        _topNavigator.push({
            title: rowData.title,
            data: rowData,
            component: OrderDetail,
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
    render:function(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: '工作台', }}
                    rightButton={<RightAddButton onPress={this.showActionSheet} />} />
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
    container: {
        flex: 1
    },
    main:{
        flex:1,
        borderTopWidth:1 / React.PixelRatio.get(),
        borderTopColor:'#e1e1e1'
    }
});

module.exports = Home;