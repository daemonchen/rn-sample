'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    View,
    ListView,
    Navigator,
    StyleSheet
} = React
/*
target: 表示从哪里打开模版 enum
{
    1: 'createOrder',
    2: 'normal' 从个人中心进入模版列表
}
*/
var commonStyle = require('../../styles/commonStyle');
var _navigator, _topNavigator = null;

var OrderSettings = require('./orderSettingsForTemplate');
var OrderTemplateList = require('./components/orderTemplateList');
var OrderTemplateDetail = require('./templates/orderTemplateDetail');

var BlueBackButton = require('../../common/blueBackButton');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            target: this.props.route.target || 2
        }
    },
    renderNavigationBar: function(){
        if (this.state.orderStatus == 2) {//从个人中心进入模版列表
            return(
                <NavigationBar
                    title={{title: this.props.route.title}} />
                );
        };
        return(
            <NavigationBar
                title={{title: this.props.route.title}}
                leftButton={<BlueBackButton navigator={_topNavigator} />} />
            );
    },
    _pressRow: function(rowData){
        if (this.state.target == 2) {//从个人中心进入模版列表
            _topNavigator.push({
                title: '模版详情',
                data: rowData,
                component: OrderTemplateDetail,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                topNavigator: _topNavigator
            })
            return;
        }else{
            var data = Object.assign({orderStatus: 1}, rowData);
            _topNavigator.push({
                title: '设置订单',
                data: data,
                component: OrderSettings,
                sceneConfig: Navigator.SceneConfigs.FloatFromRight,
                topNavigator: _topNavigator
            });
        }
    },
    renderList: function(){
        return(
            <OrderTemplateList onPressRow={this._pressRow}/>
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                {this.renderList()}
            </View>
            );
    }
});