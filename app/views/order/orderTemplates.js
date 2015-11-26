'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    View,
    ListView,
    Image,
    Navigator,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} = React
/*
orderStatus:enum
0: create
1: update
2: normal
*/
var commonStyle = require('../../styles/commonStyle');
var _navigator, _topNavigator = null;

var OrderSettings = require('./orderSettings');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return {
            dataSource: ds.cloneWithRows(['row 1', 'row 2']),
            orderStatus: 0
        }
    },
    leftButtonConfig: {
        title: 'X',
        handler:() =>
            _navigator.pop()
    },
    _pressRow: function(rowData){
        _topNavigator.push({
            component: OrderSettings,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    renderRow: function(rowData){
        return(
            <TouchableOpacity style={styles.templateItem} onPress={() => this._pressRow(rowData)}>
                <Text>订单模版</Text>
            </TouchableOpacity>
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'订单模版'}}
                    leftButton={this.leftButtonConfig} />
                <ListView
                      dataSource={this.state.dataSource}
                      renderRow={this.renderRow} />
            </View>
            );
    }
});

var styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 20
    },
    templateItem: {
        paddingVertical: 16
    }
});