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

var styles = require('../../../styles/home/task');

module.exports = React.createClass({
    getInitialState: function(){
        return{
            done: this.props.rowData.done
        }
    },
    onPressCircle: function(){
        this.props.onPressCircle(this.props.rowData, this.props.sectionID);
        this.setState({
            done: true
        });
    },
    onPressRow: function(){
        this.props.onPressRow(this.props.rowData, this.props.sectionID);
    },
    onDelete: function(){
        console.log('delete stuff');
    },
    render: function(){
        var circleImage = this.state.done ? require('../../../images/Check_box_done_1.png') : require('../../../images/Check_box_1.png')
        var swipeoutBtns = [
          {
            text: '删除',
            type: 'delete',
            onPress: this.onDelete
            // backgroundColor: ''
          }
        ]
        return(
            <Swipeout autoClose={true} right={swipeoutBtns} backgroundColor='transparent' style={styles.swipeWrapper}>
                <TouchableHighlight
                underlayColor='#eee'
                onPress={this.onPressRow}>
                    <View style={styles.rowStyle}>
                        <View style={styles.timelineWrapper}>
                            <View style={[styles.timeline, styles.timelineDone]}></View>
                            <View style={[styles.timeline, styles.timelineDone]}></View>
                        </View>
                        <TouchableWithoutFeedback onPress={this.onPressCircle} >
                            <Image source={circleImage} />
                        </TouchableWithoutFeedback>
                        <Text style={styles.rowText}>{this.props.rowData.name}</Text>
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