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

var OrderSettings = require('./orderSettings');
var OrderTemplateList = require('./components/orderTemplateList');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    leftButtonConfig: {
        title: 'X',
        handler:() =>
            _navigator.pop()
    },
    _pressRow: function(rowData){
        _topNavigator.push({
            data:{orderStatus: 1},
            component: OrderSettings,
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