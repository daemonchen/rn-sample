'use strict';
/*
这是一个wrapper页面，用来承载每一个任务设置选项的内容页
*/
var React = require('react-native');
import NavigationBar from '../../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var {
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var commonStyle = require('../../../styles/commonStyle');

module.exports = React.createClass({
    getInitialState: function(){
        return {}
    },
    onPressDone: function(){
        this.props.onPressDone();
        Actions.pop();
    },
    renderNavigator: function(){
        if (!!this.props.onPressDone) {
            return(
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: this.props.title}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                );
        }else{
            return(
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: this.props.title}}
                    leftButton={<BlueBackButton />} />
                );
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigator()}
                <View style={styles.main}>
                    <this.props.children
                    data={this.props.data}
                    target={this.props.target}
                    onPressRow={this.props.onPressRow} />
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