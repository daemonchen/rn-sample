'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var {
    View,
    Text,
    Image,
    ListView,
    Switch,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

var util = require('../../../common/util');

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
                    title={{title: this.props.title}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                );
        }else{
            return(
                <NavigationBar
                    title={{title: this.props.title}}
                    leftButton={<BlueBackButton />} />
                );
        }
    },
    goWeiXin: function(){
        var url = 'weixin://dl/officialaccounts';
        util.link(url);
    },
    goWebSite: function(){
        var url = 'http://www.nzaom.com/chaxun'
        util.link(url);
    },
    renderContent: function(){
        return(
                <View style={commonStyle.section}>
                    <Text style={commonStyle.settingGroupsTitle}>
                        开启订单进度查询，并在此添加客户手机号码，您的客户便能方便查询订单进度。
                    </Text>
                    <Text style={commonStyle.settingGroupsTitle}>
                        您的客户只需要
                    </Text>
                    <Text style={commonStyle.settingGroupsTitle}>
                        关注微信服务号“<Text style={commonStyle.blue} onPress={this.goWeiXin}>你造么服务中心</Text>”，或
                    </Text>
                    <Text style={commonStyle.settingGroupsTitle}>
                        登录<Text style={commonStyle.blue} onPress={this.goWebSite}>www.nzaom.com/chaxun</Text>
                    </Text>
                </View>
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigator()}
                <View style={styles.main}>
                    <View
                        style={commonStyle.settingItemWrapper}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.settingDetail}>
                                分享订单进度
                            </Text>
                            <Switch
                                onValueChange={(value) => this.setState({falseSwitchIsOn: value})}
                                style={{marginBottom: 10}}
                                value={this.state.falseSwitchIsOn} />
                        </View>
                    </View>
                    {this.renderContent()}
                </View>
            </View>
            );
    }
});
