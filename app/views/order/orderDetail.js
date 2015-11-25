'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
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

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        // _topNavigator = this.props.route.topNavigator;
        return {
            orderStatus: 0
        }
    },
    leftButtonConfig: {
        title: 'X',
        handler:() =>
            _navigator.pop()
    },
    rightButtonConfig: function(){
        var self = this;
        return{
            title: 'Done',
            handler:() =>
                _navigator.pop()
        }
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title:'订单'}}
                    leftButton={this.leftButtonConfig}
                    rightButton={this.rightButtonConfig()}/>
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='订单名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}/>
                    </View>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='订单描述'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        multiline={true} />
                    </View>
                    <TouchableOpacity style={commonStyle.settingItem}>
                        <Text
                        style={commonStyle.settingTitle}>
                            截止日期
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                            2015年x月x日
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/Arrow_back.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.settingItem}>
                        <Text
                        style={commonStyle.settingTitle}>
                            客户
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                            我是xx
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/Arrow_back.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.settingItem}>
                        <Text
                        style={commonStyle.settingTitle}>
                            业务员
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                            阿斯顿发
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/Arrow_back.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={commonStyle.settingItem}>
                        <Text
                        style={commonStyle.settingTitle}>
                            添加附件
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/Arrow_back.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            );
    }
});

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});