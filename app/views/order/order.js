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
var tabViewSample = require('../tabViewSample');
var OrderSegmentControl = require('./components/orderSegmentControl');
var OrderList = require('./components/orderList');
var OrderTemplates = require('./orderTemplates');
var OrderDetail = require('./orderDetail');
var _navigator, _topNavigator = null;

var order =  React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            orderStatus: 0
        }
    },
    doPush: function(component){
        _navigator.push({
            component: component,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _navigator
        });
    },
    doCreate: function(index){
        switch(index){
            case 0:
                this.setState({
                    orderStatus: index
                })
                return this.doPush(OrderDetail);
            case 1:
                this.setState({
                    orderStatus: index
                })
                return this.doPush(OrderTemplates);
            default:
                this.setState({
                    orderStatus: 0
                })
                return this.doPush(OrderDetail);
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
    rightButtonConfig:{
        title: 'Search',
        handler:() =>
            _topNavigator.push({
                title: 'from home' + Math.random(),
                component: tabViewSample,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                topNavigator: _topNavigator
            })
    },
    leftButtonConfig:function(){
        var self = this;
        return {
            title: '+',
            handler:() =>
                self.showActionSheet()
        }
    },
    render:function(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={{ title: '订单', }}
                    leftButton={this.leftButtonConfig()}
                    rightButton={this.rightButtonConfig} />
                <View style={styles.main}>
                    <OrderSegmentControl />
                    <OrderList />
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

module.exports = order;