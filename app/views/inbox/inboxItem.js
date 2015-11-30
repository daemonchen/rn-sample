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

module.exports = React.createClass({
    getInitialState: function(){
        return{}
    },
    onPress: function(){
        this.props.onPress(this.props.rowData, this.props.sectionID);
    },
    onDelete: function(){
        console.log('delete stuff');
    },
    render: function(){
        var circleImage = this.state.done ? require('../../images/Check_box_done.png') : require('../../images/Check_box_undo.png')
        var swipeoutBtns = [
          {
            text: '删除',
            type: 'delete',
            onPress: this.onDelete
            // backgroundColor: ''
          }
        ]
        return(
            <Swipeout autoClose={true} right={swipeoutBtns}
            backgroundColor='transparent'
            style={styles.swipeWrapper}>
                <TouchableHighlight
                underlayColor='#eee'
                onPress={this.onPress}>
                    <View style={styles.rowStyle}>
                        <Image source={circleImage} style={styles.inboxIcon}/>
                        <Text style={styles.rowText}>
                            {this.props.rowData.subList[0].name}
                        </Text>
                        <Text style={[styles.timeLabel, commonStyle.textLight]}>
                            {this.props.rowData.timeLabel}
                        </Text>
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