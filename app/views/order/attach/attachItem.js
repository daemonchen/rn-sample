'use strict';
var React = require('react-native')
var {
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
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
    onPress: function(){
        this.props.onPress(this.props.rowData, this.props.sectionID);
        this.setState({
            done: true
        });
    },
    onDelete: function(){
        console.log('delete stuff');
    },
    render: function(){
        var circleImage = this.state.done ? require('../../../images/Check_box_done.png') : require('../../../images/Check_box_undo.png')
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
                <TouchableOpacity onPress={this.onPress}>
                    <View style={styles.rowStyle}>
                        <Image source={circleImage} />
                        <Text style={styles.rowText}>{this.props.rowData.name}</Text>
                    </View>
                </TouchableOpacity>
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