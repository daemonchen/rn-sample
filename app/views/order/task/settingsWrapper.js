'use strict';
/*
这是一个wrapper页面，用来承载每一个任务设置选项的内容页
*/
var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var commonStyle = require('../../../styles/commonStyle');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    onPressDone: function(){
        this.props.route.onPressDone();
        _topNavigator.pop();
    },
    renderNavigator: function(){
        if (!!this.props.route.onPressDone) {
            return(
                <NavigationBar
                    title={{title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                );
        }else{
            return(
                <NavigationBar
                    title={{title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />} />
                );
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigator()}
                <View style={styles.main}>
                    <this.props.route.children
                    data={this.props.route.data}
                    target={this.props.route.target}
                    onPressRow={this.props.route.onPressRow} />
                </View>
            </View>
            );
    }
});
var styles = StyleSheet.create({
    main: {
        flex: 1
    }
});