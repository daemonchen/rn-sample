'use strict';
var React = require('react-native')

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

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/inbox/inboxItem');
var contactsStyle = require('../../styles/contact/contactsItem');

var util = require('../../common/util');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            isDelete: false,
            readStatus: this.props.rowData.readStatus
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            isDelete: false,
            readStatus: nextProps.rowData.readStatus//1:未读，2:已读
        });
    },
    onPress: function(){
        var rowData = Object.assign(this.props.rowData, {
            readStatus: 2
        });
        if (this.state.readStatus == 1) {//如果是未读状态，需要标记已读
            this.setState({
                readStatus: 2
            });
            this.props.onUpdate(rowData);
        };
        this.props.onPress(rowData, this.props.sectionID);
    },
    onUpdate: function(){
        this.setState({
            readStatus: (this.state.readStatus == 1) ? 2 : 1
        });
        var rowData = Object.assign(this.props.rowData, {
            readStatus: this.state.readStatus
        });
        this.props.onUpdate(rowData);
    },
    onDelete: function(){
        // this.setState({
        //     isDelete: true
        // });
        this.props.onDelete(this.props.rowData, this.props.sectionID);
    },
    iconList:[
        require('../../images/inbox/order_circle.png'),
        require('../../images/inbox/task_circle.png'),
        require('../../images/inbox/notifications-circle.png')
    ],
    renderUserAvatar: function(){
        var data = this.props.rowData;
        if (data.fromUser.avatar) {
            return(
                <Image
                  style={contactsStyle.contactsItemCircle}
                  source={{uri: data.fromUser.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: data.fromUser.fromUser.bgColor
            }
            return(
                <View style={[contactsStyle.contactsItemCircle, circleBackground]}>
                    <Text style={contactsStyle.contactsItemTitle}>
                        {data.fromUser.simpleUserName}
                    </Text>
                </View>
                )
        }
    },
    renderAvatar: function(){
        var data = this.props.rowData;
        var circleImage = this.iconList[data.msgType-1] || this.iconList[2];
        if (!data.fromUser) {
            return(
                <Image source={circleImage} style={styles.inboxIcon}/>
                );
        }else{
            return this.renderUserAvatar();
        }
    },
    renderDot: function(){
        if (this.props.rowData.unreadMsgCount == 0) {
            return(<View />);
        };
        var labelWidth = parseInt(this.props.rowData.unreadMsgCount/10)* 10 + 20;
        return(
            <Text style={[styles.redDot, commonStyle.textWhite, {width: labelWidth, height: 20, borderRadius: 10}]}>
                {this.props.rowData.unreadMsgCount}
            </Text>
            );
    },
    renderTimeLabel: function(timestamp){
        var time = util.formatTimestamp(timestamp);
        return(
            <Text style={[styles.timeLabel, commonStyle.textGray]}>
                {time}
            </Text>
            )
    },
    _handleSwipeout: function(){
        this.props._handleSwipeout(this.props.rowData, this.props.sectionID, this.props.rowID);
    },
    render: function(){
        var readText = (this.state.readStatus == 1) ? '已读' : '未读'
        var swipeoutBtns = [
          {
            text: readText,
            type: 'secondary',
            onPress: this.onUpdate
            // backgroundColor: ''
          },
          {
            text: '删除',
            type: 'delete',
            onPress: this.onDelete
            // backgroundColor: ''
          }
        ]
        if (!!this.state.isDelete) {
            return(<View />)
        };
        return(
            <Swipeout autoClose={true} right={swipeoutBtns}
            backgroundColor='transparent'
            scroll={event => this.props._allowScroll(event)}
            close={!this.props.rowData.active}
            onOpen={this._handleSwipeout}
            style={styles.swipeWrapper}>
                <TouchableHighlight
                underlayColor='#eee'
                onPress={this.onPress}>
                    <View style={styles.rowStyle}>
                        {this.renderAvatar()}
                        <View style={styles.rowTextWrapper}>
                            <Text style={styles.inboxTitle}
                            numberOfLines={1}>
                                {this.props.rowData.categoryName}
                            </Text>
                            <Text style={[styles.inboxDetail,commonStyle.textGray]}
                            numberOfLines={1} >
                                {this.props.rowData.lastMsgContent}
                            </Text>
                        </View>
                        <View style={styles.rightLabel}>
                            {this.renderTimeLabel(this.props.rowData.lastMsgModified)}
                            {this.renderDot()}
                        </View>
                    </View>
                </TouchableHighlight>
            </Swipeout>
            )
        // return (
        //     <TouchableOpacity onPress={this.onPress}>
        //         <View style={styles.rowStyle}>
        //             <View style={[styles.circle, circleDone]} />
        //             <Text style={styles.rowText}>{this.props.rowData.name}</Text>
        //         </View>
        //     </TouchableOpacity>
        //     )
    }
});