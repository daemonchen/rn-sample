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
            readStatus: this.props.rowData.readStatus//1:未读，2:已读
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            isDelete: false
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
        this.setState({
            isDelete: true
        });
        this.props.onDelete(this.props.rowData, this.props.sectionID);
    },
    iconList:[
        require('../../images/inbox/Order_icon.png'),
        require('../../images/inbox/task_icon.png'),
        require('../../images/inbox/sys_icon.png')
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
        var circleImage = this.iconList[data.msgType-1] || require('../../images/inbox/sys_icon.png');
        if (!data.fromUser) {
            return(
                <Image source={circleImage} style={styles.inboxIcon}/>
                );
        }else{
            return this.renderUserAvatar();
        }
    },
    renderDot: function(){
        if (this.state.readStatus == 1) {
            return(
                <Image
                  style={styles.dot}
                  source={require('../../images/inbox/dot.png')} />
                );
        }else{
            return(
                <View />
                );
        }
    },
    renderTimeLabel: function(timestamp){
        var time = util.formatTimestamp(timestamp);
        return(
            <Text style={[styles.timeLabel, commonStyle.textLight]}>
                {time}
            </Text>
            )
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
            style={styles.swipeWrapper}>
                <TouchableHighlight
                underlayColor='#eee'
                onPress={this.onPress}>
                    <View style={styles.rowStyle}>
                        {this.renderAvatar()}
                        {this.renderDot()}
                        <View style={styles.rowTextWrapper}>
                            <Text style={styles.inboxTitle}
                            numberOfLines={1}>
                                {this.props.rowData.msgTitle}
                            </Text>
                            <Text style={[styles.inboxDetail,commonStyle.textLight]}
                            numberOfLines={1} >
                                {this.props.rowData.msgContent}
                            </Text>
                        </View>
                        {this.renderTimeLabel(this.props.rowData.gmtCreate)}
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