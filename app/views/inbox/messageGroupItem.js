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

var Swipeout = require('react-native-swipeout');

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
        // this.setState({
        //     isDelete: true
        // });
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
        console.log('-----------this.props.rowData.msgContentMap', this.props.rowData.msgContentMap);
        return _.map(this.props.rowData.msgContentMap, function(item, key){
            return self.renderItem(item, key);
        });
        return(<View />);
    },

    render: function(){

        if (!!this.state.isDelete) {
            return(<View />)
        };
        return(
            <View style={commonStyle.cardWraper}>
                {this.renderTimeLabel(this.props.rowData.gmtCreate)}
                <TouchableHighlight
                underlayColor='#eee'
                onPress={this.onPress}
                style={commonStyle.card}>
                    <View>
                        <View style={commonStyle.cardHeader}>
                            <Text style={[commonStyle.cardHeaderTitle, commonStyle.textWhite]}>TASK</Text>
                        </View>
                        <View style={commonStyle.cardBody}>
                            <Text style={[commonStyle.cardBodyTitle, commonStyle.textDark]}>
                                {this.props.rowData.msgContent}
                            </Text>
                            {this.renderCardContent()}
                        </View>
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
                    </View>
                </TouchableHighlight>
            </View>
            )
    }
});