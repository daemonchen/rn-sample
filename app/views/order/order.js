'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var {
    View,
    Text,
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
var appConstants = require('../../constants/appConstants');

var schemeStore = require('../../stores/scheme/schemeStore');


var order =  React.createClass({
    getInitialState: function(){
        return {
            tabIndex: 0
        }
    },
    componentDidMount: function(){
        this.unlistenScheme = schemeStore.listen(this.onSchemeChange);
    },
    componentWillUnmount: function() {
        this.unlistenScheme();
    },
    onSchemeChange: function(){
        var result = schemeStore.getState();
        var params = util.getParams(result.scheme.split('?')[1]);
        if (/nzaom:\/\/order/.test(result.scheme)) {
            this.setState({
                tabIndex: parseInt(params.status)
            })
        };
    },
    doPushOrderSetting: function(){
        Actions.orderSettings({
            data: {orderStatus: 1}
        });
    },
    doPushOrderTemplates: function(){
        Actions.orderTemplates({
            target: 1
        });
    },
    doCreate: function(index){
        switch(index){
            case 0:
                return this.doPushOrderSetting();
            case 1:
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
    onPressOrderRow: function(rowData){
        Actions.orderDetail({
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
                    <OrderList
                    onPressRow={this.onPressOrderRow}
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
    renderNavigationBar: function(){
        var rights = appConstants.userRights.rights;
        var targetRights = 2;
        if ((rights & targetRights) == targetRights) {
            return(
                <NavigationBar
                    title={{ title: '订单' }}
                    rightButton={<RightAddButton onPress={this.showActionSheet} />} />
                );
        }else{
            return(
                <NavigationBar
                    title={{ title: '订单' }} />
                );
        }
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.main}>
                    <OrderSegmentControl
                    selectedIndex={this.state.tabIndex}
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