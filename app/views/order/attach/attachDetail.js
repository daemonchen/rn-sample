'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var SearchBar = require('react-native-search-bar');
var moment = require('moment');
var {
    View,
    Text,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

var BlueBackButton = require('../../../common/blueBackButton');
var RightSettingButton = require('../../../common/rightSettingButton');
var AttachSetting = require('./attachSetting');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {}
    },
    _pressSettingButton: function(){
        _topNavigator.push({
            title: '附件设置',
            data: this.props.route.data,
            component: AttachSetting,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        })
    },
    renderTime: function(timestamp){
        var time = moment(timestamp).format('YYYY年MM月DD日');
        return(
            <Text
            style={commonStyle.settingDetail}>
                {time}
            </Text>
            )
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightSettingButton onPress={this._pressSettingButton} />} />
                <View style={styles.main}>
                    <View style={styles.attachImageWrapper}>
                        <Image
                          source={{uri: this.props.route.data.fileAddress}}
                          style={styles.attachImageMiddle} />
                    </View>
                    <Text style={styles.attachTitle}>
                        {this.props.route.data.fileName}
                    </Text>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.cleanCache}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={[commonStyle.settingTitle, commonStyle.textLight]}>
                                上传人
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.props.route.data.operatorName}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={[commonStyle.settingTitle, commonStyle.textLight]}>
                                时间
                            </Text>
                            {this.renderTime(this.props.route.data.gmtCreate)}
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            );
    }
})