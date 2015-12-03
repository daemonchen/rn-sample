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

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/inbox/inboxItem');
// var util = require('../../common/util');
var Button = require('../../common/button');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            agree: this.props.data.agree
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            agree: nextProps.data.agree
        });
    },
    doAgree: function(){
        this.props.onAgree(this.props.data);
    },
    renderInviteButton: function(){
        if (this.state.agree) {
            return(
                <Text style={[styles.timeLabel, commonStyle.textLight]}>
                    已同意
                </Text>
                )
        }
        return(
            <Button
            style={styles.rightButton}
            onPress={this.doAgree} >
                同意
            </Button>
            )
    },
    render: function(){
        return (
            <TouchableHighlight
            underlayColor='#eee'>
                <View style={styles.rowStyle}>
                    <Image source={require('../../images/inbox/sys_icon.png')}
                    style={styles.inboxIcon}/>
                    <View style={styles.rowTextWrapper}>
                        <Text style={styles.inboxTitle}>
                            {this.props.data.factoryName}
                        </Text>
                        <Text style={styles.inboxDetail}>
                            邀请你加入组织
                        </Text>
                        <Text style={[styles.inboxSubDetail, commonStyle.textLight]}>
                            邀请人：{this.props.data.inviter}
                        </Text>
                    </View>
                    {this.renderInviteButton()}
                </View>
            </TouchableHighlight>
            )
    }
});