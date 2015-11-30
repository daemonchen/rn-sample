'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    View,
    ListView,
    Navigator,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');
var _navigator, _topNavigator = null;

var OrderTemplateDetail = require('../order/orderTemplateDetail');
var OrderTemplateList = require('../order/components/orderTemplateList');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    leftButtonConfig: {
        title: '<',
        handler:() =>
            _navigator.pop()
    },
    _pressRow: function(rowData){
        _topNavigator.push({
            title: rowData,
            component: OrderTemplateDetail,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    renderList: function(){
        return(
            <OrderTemplateList onPressRow={this._pressRow}/>
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'订单模版'}}
                    leftButton={this.leftButtonConfig} />
                    {this.renderList()}
            </View>
            );
    }
});