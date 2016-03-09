'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var {
    View,
    ListView,
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

var OrderSettingsForTemplate = require('./orderSettingsForTemplate');
var OrderTemplateList = require('./components/orderTemplateList');
var OrderTemplateSetting = require('./templates/orderTemplateSetting');

var BlueBackButton = require('../../common/blueBackButton');

module.exports = React.createClass({
    getInitialState: function(){
        return {
            target: this.props.target || 2
        }
    },
    renderNavigationBar: function(){
        if (this.state.orderStatus == 2) {//从个人中心进入模版列表
            return(
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: this.props.title}} />
                );
        };
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                title={{title: this.props.title}}
                leftButton={<BlueBackButton />} />
            );
    },
    _pressRow: function(rowData){
        if (this.state.target == 2) {//从个人中心进入模版列表
            Actions.orderTemplateSetting({
                title: '模版详情',
                target: 2,
                data: rowData
            });
        }else{
            Actions.orderSettingsForTemplate({
                title: '设置订单',
                data: rowData
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