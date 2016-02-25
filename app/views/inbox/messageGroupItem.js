'use strict';
var React = require('react-native')
var _ = require('underscore');

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

var ToolTip = require('react-native-tooltip');

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/inbox/inboxItem');
var contactsStyle = require('../../styles/contact/contactsItem');

var util = require('../../common/util');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            isDelete: false
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            isDelete: false
        });
    },
    onPress: function(){
        var rowData = this.props.rowData;
        this.props.onPress(rowData, this.props.sectionID);
    },
    onDelete: function(){
        this.props.onDelete(this.props.rowData, this.props.sectionID);
    },
    messageTitleBgColor:["#4285F4", "#34A853"],


    renderTimeLabel: function(timestamp){
        var time = util.formatTimestamp(timestamp);
        return(
            <Text style={[commonStyle.cardOuterTitle, commonStyle.textGray]}>
                {time}
            </Text>
            )
    },

    renderItem: function(item, key){
        return(
            <View style={commonStyle.cardBodyContentItem} key={key}>
                <Text
                style={[commonStyle.settingTitle, commonStyle.textGray]}>
                    {key}:
                </Text>
                <Text
                style={[commonStyle.settingDetail, commonStyle.textDark]}>
                    {item}
                </Text>
            </View>
            );
    },

    renderCardContent: function(){
        var self = this;
        return _.map(this.props.rowData.msgContentMap, function(item, key){
            return self.renderItem(item, key);
        });
        return(<View />);
    },
    renderImage: function(){
        if (!this.props.rowData.image) {
            return(<View />);
        };
        return(<Image resizeMode="cover" style={commonStyle.cardBodyImage} source={{uri: this.props.rowData.image}}/>);
    },
    renderCardHeader: function(){
        if (this.props.msgType == 4) {//系统消息
            return(<View />);
        };
        var msgSubTypeIndex = this.props.rowData.msgSubType %2;
        var bgColor = this.messageTitleBgColor[msgSubTypeIndex];
        return(
            <View style={[commonStyle.cardHeader, {backgroundColor: bgColor}]}>
                <Text style={[commonStyle.cardHeaderTitle, commonStyle.textWhite]}>
                    {this.props.rowData.msgTitle}
                </Text>
            </View>
            );
    },

    renderCardFooter: function(){
        if (!this.props.rowData.url) {
            return(<View />);
        };
        return(
            <View style={commonStyle.cardFooter}>
                <View style={commonStyle.cardFooterBody}>
                    <Text
                    style={commonStyle.settingDetail}>
                        查看详情
                    </Text>
                    <Image
                    style={commonStyle.settingArrow}
                    source={require('../../images/common/arrow_right.png')} />
                </View>
            </View>
            );
    },

    render: function(){

        if (!!this.state.isDelete) {
            return(<View />)
        };
        return(
            <View style={commonStyle.cardWraper}>
                {this.renderTimeLabel(this.props.rowData.gmtCreate)}
                <ToolTip
                    ref='theToolTip'
                    actions={[
                      {text: '删除', onPress: () => { this.onDelete() }}
                    ]}
                    underlayColor='#eee'
                    onPress={this.onPress}
                    longPress={true}
                    style={commonStyle.card}>
                        <View>
                            {this.renderCardHeader()}
                            <View style={commonStyle.cardBody}>
                                {this.renderImage()}
                                <Text style={[commonStyle.cardBodyTitle, commonStyle.textDark]}>
                                    {this.props.rowData.msgContent}
                                </Text>
                                {this.renderCardContent()}
                            </View>
                            {this.renderCardFooter()}

                        </View>
                  </ToolTip>

            </View>
            )
    }
});