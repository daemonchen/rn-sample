'use strict';
/*
    add attach from task settings
*/
var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');
var {
    View,
    Text,
    Image,
    ListView,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} = React;


var attachAction = require('../../../actions/attach/attachAction');
var commonStyle = require('../../../styles/commonStyle');
var util = require('../../../common/util');
var appConstants = require('../../../constants/appConstants');

var BlueBackButton = require('../../../common/blueBackButton');
var RightAddButton = require('../../../common/rightAddButton');

var AttachList = require('./attachList');

module.exports = React.createClass({
    getInitialState: function(){
        return {
            taskId: this.props.data.id
        }
    },
    doAddPhoto: function(){
        this.onEmptyButtonPress();
    },
    onEmptyButtonPress: function(){
        var params = {};
        if (this.state.taskStatus == 1) {
            params = {
                hostType: '2'
            }
        }else{
            params = {
                hostId: this.state.taskId + '',
                hostType: '2'
            }
        }
        util.showPhotoPicker({
            title: ''
        }, (response)=>{
            var name = response.uri.substring(response.uri.lastIndexOf('/') + 1)
            var uri = response.uri.replace('file://', '');
            var fileObj = Object.assign({
                count:1,
                fileOrgName: name,
                uri: uri
            }, params);
            attachAction.create(fileObj);
        });
    },
    _onPressRow: function(rowData, sectionID){
        Actions.attachDetail({
            title: '附件详情',
            data: rowData
        });
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                title={{ title: '附件' }}
                leftButton={<BlueBackButton />} />
            );
        // var rights = appConstants.userRights.rights;
        // var targetRights = 512;
        // if ((rights & targetRights) == targetRights){
        //     return(
        //         <NavigationBar
        //             title={{ title: '附件' }}
        //             leftButton={<BlueBackButton />}
        //             rightButton={<RightAddButton onPress={this.doAddPhoto} />} />
        //         );
        // }else{
        // }
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.main}>
                    <AttachList
                    data={this.props.data}
                    hostType={2}
                    onPressRow={this._onPressRow}
                    onEmptyButtonPress={this.onEmptyButtonPress}/>
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    main:{
        flex:1
    }
});