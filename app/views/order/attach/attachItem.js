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
var appConstants = require('../../../constants/appConstants');

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
        var rights = appConstants.userRights.rights;
        var targetRights = 1024;
        if ((rights & targetRights) == targetRights){
            return(
                <Swipeout autoClose={true} right={swipeoutBtns} backgroundColor='transparent' style={styles.swipeWrapper}>
                    <TouchableOpacity onPress={this.onPress}>
                        <View style={styles.rowStyle}>
                            <Image source={{uri: this.props.rowData.fileAddress}}
                            style={styles.attachImage} />
                            <Text style={styles.attachItemText}
                            numberOfLines={1}>
                                {this.props.rowData.fileName}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Swipeout>
                )
        }else{
            return(
                <TouchableOpacity onPress={this.onPress}>
                    <View style={styles.rowStyle}>
                        <Image source={{uri: this.props.rowData.fileAddress}}
                        style={styles.attachImage} />
                        <Text style={styles.attachItemText}
                        numberOfLines={1}>
                            {this.props.rowData.fileName}
                        </Text>
                    </View>
                </TouchableOpacity>
                )
        }
    }
});