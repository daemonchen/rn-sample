'use strict';
var React = require('react-native')
var TimerMixin = require('react-timer-mixin');
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var {
    Text,
    TextInput,
    Image,
    View,
    ListView,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var commentAction = require('../../../actions/comment/commentAction');
// var orderStore = require('../../../stores/order/orderStore');
var util = require('../../../common/util');

var styles = require('../../../styles/order/comment.js');
var commonStyle = require('../../../styles/commonStyle');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function() {
        return {
            targetId: this.props.data,//任务id
            atUserIds: [],
            comment: '',
            type: 2
        }
    },
    componentDidMount: function(){
    },
    componentWillUnmount: function() {
    },
    onChangeComment: function(text){
        this.setState({
            comment: text
        });
    },
    sendComment: function(){
        commentAction.create({
            targetId: this.state.targetId,
            atUserIds: this.state.atUserIds,
            comment: this.state.comment,
            type: 2
        });
    },
    inputFocused: function(refName) {
      setTimeout(() => {
        var scrollResponder = this.refs.scrollView.getScrollResponder();
        scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
          React.findNodeHandle(this.refs[refName]),
          110, //additionalOffset
          true
        );
      }, 50);
    },
    render: function() {
        return(
            <View style={styles.commentBarWrapper}>
                <TextInput placeholder='通过@提醒特定成员'
                        style={styles.commentTextInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeComment}
                        returnKeyType={'send'}
                        onSubmitEditing={this.sendComment} />
                <TouchableOpacity onPress={this.sendComment}
                style={styles.commentSendButtonWrapper}>
                    <Image source={require('../../../images/task/add_comment.png')}
                    style={styles.commentSendButton} />
                </TouchableOpacity>
            </View>
            );
    }
});