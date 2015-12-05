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

var attachListAction = require('../../../actions/attach/attachListAction');

var Swipeout = require('react-native-swipeout');

var styles = require('../../../styles/order/orderDetail');

module.exports = React.createClass({
    getInitialState: function(){
        return{}
    },
    onPress: function(){
        this.props.onPress(this.props.rowData, this.props.sectionID);
    },
    onDelete: function(){
        attachListAction.delete({
            id: this.props.rowData.id
        });
    },
    render: function(){
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
                        <Image source={{uri: this.props.rowData.fileAddress}}
                        style={styles.attachImage} />
                        <Text style={styles.attachItemText}>
                            {this.props.rowData.fileName}
                        </Text>
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