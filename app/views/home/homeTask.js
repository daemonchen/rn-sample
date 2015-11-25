'use strict';
var React = require('react-native')
var {
    Text,
    View,
    ListView,
    TouchableOpacity,
    StyleSheet
} = React

var Swipeout = require('react-native-swipeout');

var styles = require('../../styles/home/task.js');
var homeTask = React.createClass({
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
        var circleDone = this.state.done ? styles.circleDone : null
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
                        <View style={[styles.circle, circleDone]} />
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

module.exports = homeTask