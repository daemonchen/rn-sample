'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var BlueBackButton = require('../../common/blueBackButton');
var commonStyle = require('../../styles/commonStyle');
var util = require('../../common/util');
var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;


        return {
            data: this.props.route.data
        }
    },
    renderTimeLabel: function(timestamp){
        var time = util.formatTimestamp(timestamp);
        return(
            <Text style={[commonStyle.articleTime, commonStyle.textLight]}>{time}</Text>
            )
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: '系统消息' }}
                    leftButton={<BlueBackButton navigator={_navigator}/>} />
                <View style={styles.main}>
                    <Text style={commonStyle.articleTitle}>{this.state.data.msgTitle}</Text>
                    {this.renderTimeLabel(this.state.data.gmtCreate)}
                    <Text style={commonStyle.articleDetail}>{this.state.data.msgContent}</Text>
                </View>
            </View>
            );
    }
});
var styles = StyleSheet.create({
    main:{
        flex:1
    }
});