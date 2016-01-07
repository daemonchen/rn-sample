'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var BlueBackButton = require('../../common/blueBackButton');
var commonStyle = require('../../styles/commonStyle');
var util = require('../../common/util');

module.exports = React.createClass({
    getInitialState: function(){
        return {
            data: this.props.data
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
                    leftButton={<BlueBackButton />} />
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