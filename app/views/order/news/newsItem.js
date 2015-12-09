'use strict';
var React = require('react-native')
var moment = require('moment');
var {
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    TouchableWithoutFeedback,
    StyleSheet
} = React

var Swipeout = require('react-native-swipeout');
var taskListAction = require('../../../actions/task/taskListAction');
var taskListStore = require('../../../stores/task/taskListStore');

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var util = require('../../../common/util');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            news: this.props.rowData.dynamic,
            user: this.props.rowData.user
        }
    },
    renderAvatar: function(){
        var user = this.state.user;
        if (!user) {
            return(<View style={styles.newsItemAvatar}/>);
        };
        if (user.avatar) {
            return(
                <Image
                  style={styles.newsItemAvatar}
                  source={{uri: user.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: user.bgColor
            }
            return(
                <View style={[styles.newsItemAvatar, circleBackground]}>
                    <Text style={styles.taskItemTitle}>
                        {user.simpleUserName}
                    </Text>
                </View>
                )
        }
    },
    renderTimeLabel: function(timestamp){
        var time = util.formatTimestamp(timestamp);
        return(
            <Text style={[styles.rowText, commonStyle.textGray]}>
                {time}
            </Text>
            );
    },
    render: function(){
        return(
            <TouchableHighlight
            underlayColor='#eee'>
                <View style={styles.rowStyle}>
                    {this.renderAvatar()}
                    <View style={styles.newsTimeline}/>
                    <Image
                      style={styles.newsTag}
                      source={require('../../../images/order/circle_blue.png')} />

                    <View style={styles.contentWrapper}>
                        <Text style={styles.rowText}>
                            {this.state.news.msg}
                        </Text>
                        {this.renderTimeLabel(this.state.news.gmtCreate)}
                    </View>
                </View>
            </TouchableHighlight>
            )
    }
});