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


var commonStyle = require('../../styles/commonStyle');
var OrderSegmentControl = require('./components/orderSegmentControl');
var OrderList = require('./components/orderList');
var OrderTemplates = require('./orderTemplates');
var OrderSettings = require('./orderSettings');
var OrderDetail = require('./orderDetail');
var RightAddButton = require('../../common/rightAddButton');

var util = require('../../common/util');

var _navigator, _topNavigator = null;

var order =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            tabIndex: 0,
            orderStatus: 0
        }
    },
    doPushOrderSetting: function(){
        _topNavigator.push({
            title: '新建订单',
            data: {orderStatus: 1},
            component: OrderSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    doPushOrderTemplates: function(){
        _topNavigator.push({
            title: '选择模版',
            target: 1,
            component: OrderTemplates,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    doCreate: function(index){
        switch(index){
            case 0:
                this.setState({
                    orderStatus: index
                })
                return this.doPushOrderSetting();
            case 1:
                this.setState({
                    orderStatus: index
                })
                return this.doPushOrderTemplates();
            default:
                return;
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
                self.doCreate(buttonIndex)
              // self.setState({ clicked: self.actionList[buttonIndex] });
            });
    },
    actionList: ['新建订单','从模版创建','取消'],
    onPressOrderRow: function(rowData, sectionID){
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
                    <OrderList
                    onPressRow={this.onPressOrderRow}
                    events={{}}
                    status={0} />
                )
            case 1:
                return(
                    <OrderList
                    onPressRow={this.onPressOrderRow}
                    status={1} />
                )
        }
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '订单', }}
                    rightButton={<RightAddButton onPress={this.showActionSheet} />} />
                <View style={styles.main}>
                    <OrderSegmentControl
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

module.exports = order;