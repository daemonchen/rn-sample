'use strict';
var React = require('react-native');
import NavigationBar from 'react-native-navbar';
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var RefreshInfiniteListView = require('react-native-refresh-infinite-listview');
var {
    Text,
    TextInput,
    Image,
    View,
    ScrollView,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var commentAction = require('../../../actions/comment/commentAction');
var commentStore = require('../../../stores/comment/commentStore');
var util = require('../../../common/util');

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var styles = require('../../../styles/order/comment.js');
var commonStyle = require('../../../styles/commonStyle');
var contactsStyle = require('../../../styles/contact/contactsItem');

module.exports = React.createClass({
    mixins: [TimerMixin],
    displayName: 'createComment',
    getInitialState: function() {
        return {
            targetId: this.props.data,//任务id
            atUserIds: [],
            atUsers: [],
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
    cacheUserIds: function(users){
        var ids = [];
        for (var i = 0; i < users.length; i++) {
            ids.push(users[i].userId);
        };
        this.setState({
            atUserIds: ids,
            atUsers: users
        });
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
            Actions.pop();
        };
        if (result.type == 'at') {
            this.cacheUserIds(result.atUsers);
        };
    },

     _setRelatedPerson: function(){//增加@的人
        Actions.commentAtPersonList({
            target: 2,
            atUsers: this.state.atUsers,
            atUserIds: this.state.atUserIds
            // onPressContactRow: this.onPressContactRow
        });
    },
    onChangeComment: function(text){
        var reg = /@$/;
        if (reg.test(text)) {
            this._setRelatedPerson();
        }
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
    renderNavigationBar: function(){
        return(
            <NavigationBar
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />}
                rightButton={<RightDoneButton onPress={this.sendComment} />} />
            );
    },
    renderAvatar: function(data){
        if (!data) {
            return(<View style={styles.commentAvatarCircle}/>);
        };
        if (data.avatar) {
            return(
                <Image
                  style={styles.commentAvatarCircle}
                  source={{uri: data.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: data.bgColor
            }
            return(
                <View style={[styles.commentAvatarCircle, circleBackground]}>
                    <Text style={styles.commentAvatarCircleText}>{data.simpleUserName}</Text>
                </View>
                )
        }
    },
    renderRelatedPersonItem: function(){
        var self = this;
        var usersArray = this.state.atUsers.slice(0,3);
        var items = usersArray.map(function (item, index) {
            return self.renderAvatar(item)
        });
        return items;
    },
    renderMore: function(){
        if (this.state.atUsers.length > 3) {
            return(<Text style={{paddingLeft: 10, paddingTop: 10}}>...</Text>);
        };
        return(<View />)
    },
    renderRelatedPerson: function(){
        if (!!this.state.atUsers && this.state.atUsers.length > 0) {
            return(
                <View
                style={styles.commentAvatarCircleWrapper}>
                    {this.renderRelatedPersonItem()}
                    {this.renderMore()}
                </View>
                )
        };
        return (
            <View style={styles.commentAvatarCircleWrapper}/>
            );
    },
    render: function() {
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={[styles.main, {backgroundColor:'#fff'}]}>
                    <View style={commonStyle.centerWrapper}>
                        <View style={commonStyle.textAreaWrapper}>
                            <TextInput placeholder='评论内容'
                            style={commonStyle.textArea}
                            clearButtonMode={'while-editing'}
                            value={this.state.description}
                            onChangeText={this.onChangeComment}
                            multiline={true}
                            returnKeyType={'done'} />
                        </View>
                    </View>
                    <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this._setRelatedPerson}>
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            style={commonStyle.settingTitle}>
                                @ 提醒谁看
                            </Text>
                            {this.renderRelatedPerson()}
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
            );
    }
});