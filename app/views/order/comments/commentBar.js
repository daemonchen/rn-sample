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
var commentStore = require('../../../stores/comment/commentStore');
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
        this.unlisten = commentStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function(){
        var result = commentStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (result.type == 'create') {
            this.setState({
                comment: ''
            });
        };
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
    render: function() {
        return(
            <View style={styles.commentBarWrapper}>
                <TextInput placeholder='通过@提醒特定成员'
                        style={styles.commentTextInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeComment}
                        returnKeyType={'send'}
                        clearTextOnFocus={true}
                        value={this.state.comment}
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