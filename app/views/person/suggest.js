'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {View,
    Text,
    TextInput,
    Navigator,
    StyleSheet
} = React;
var Button = require('../../common/button.js');
var commonStyle = require('../../styles/commonStyle');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var launch = require('../launch');

var _navigator, _topNavigator = null;
module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    doCommit: function(){
        _navigator.pop();
    },
    leftButtonConfig: {
        title: '<',
        handler:() =>
            _navigator.pop()
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'意见反馈'}}
                    leftButton={this.leftButtonConfig} />
                <View style={styles.main}>
                    <View style={commonStyle.textAreaWrapper}>
                        <TextInput placeholder='请输入您的产品意见，我们将不断优化产品体验'
                        secureTextEntry={true}
                        multiline={true}
                        style={commonStyle.textArea}
                        clearButtonMode={'while-editing'}/>
                    </View>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.doCommit} >
                        提交
                    </Button>
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});