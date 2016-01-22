'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
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
    TouchableHighlight,
    ActivityIndicatorIOS,
    ActionSheetIOS,
    StyleSheet
} = React;


var attachListStore = require('../../../stores/attach/attachListStore');
var attachListAction = require('../../../actions/attach/attachListAction');
var attachStore = require('../../../stores/attach/attachStore');

var commonStyle = require('../../../styles/commonStyle');
var appConstants = require('../../../constants/appConstants');

// var AttachItem = require('./attachItem');
var Button = require('../../../common/button.js');
var CollectionView = require('../../../common/collectionView');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            loaded : false,
            list: []
        }
    },
    componentDidMount: function() {
        this.unlistenAttach = attachStore.listen(this.onAttachChange);
        this.unlisten = attachListStore.listen(this.onChange);
        this.fetchAttachData();
    },
    componentWillUnmount: function(){
        this.unlisten();
        this.unlistenAttach()
    },
    onAttachChange: function(){
        var result = attachStore.getState();
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        if (result.type == 'create') {
            this.setTimeout(this.fetchAttachData, 350);
        };
        if (result.type == 'get') {
            this.setTimeout(this.fetchAttachData, 350);
        };
    },
    handleGet: function(result){
        console.log('-----handleGet', result);
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        this.setState({
            list: result.data || [],
            loaded     : true,
        });
    },
    handleDelete: function(result){
        if (result.status != 200 && !!result.message) {
            this.setState({
                loaded: true,
                list: []
            })
            return;
        }
        this.setState({
            list: result.data || [],
            loaded: true
        });
        return;
    },
    onChange: function(){
        var result = attachListStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
            case 'delete':
                return this.handleDelete(result)
        }
    },
    _goOrderDescribe: function(){
        Actions.taskDescribe({
            descriptionUrl: this.state.taskData.descriptionUrl
        });
    },
    fetchAttachData: function(){
        attachListAction.getList({
            hostId: this.props.data.id,
            hostType: this.props.hostType
        });
    },
    onPressAttachRow: function(rowData,sectionID){
        Actions.attachDetail({
            title: '附件详情',
            data: rowData
        });
    },
    renderRow: function(rowData, index) {
        if (!rowData) {
            return (
                <View style={commonStyle.collectionItem} key={index}>
                </View>
                );
        };
        return(
            <TouchableOpacity onPress={()=>{this.onPressAttachRow(rowData)}} key={index}>
                <View style={[commonStyle.collectionItem, index%2==0 ? commonStyle.collectionItemPaddingRight : commonStyle.collectionItemPaddingLeft]}>
                    <Image source={{uri: rowData.fileAddress}}
                    style={commonStyle.collectionImage}>
                        <Text style={commonStyle.collectionTitle}
                        numberOfLines={1}>
                            {rowData.fileName}
                        </Text>
                    </Image>
                </View>
            </TouchableOpacity>
            );
    },
    render: function() {
        return(
            <ScrollView>
                <View style={commonStyle.section}>
                    <Text style={commonStyle.settingGroupsTitle}>订单描述</Text>
                    <TouchableHighlight
                    style={commonStyle.settingItemWrapper}
                    underlayColor='#eee'
                    onPress={this._goOrderDescribe} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            numberOfLines={3}
                            style={commonStyle.settingDetail}>
                                {this.props.data.description}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
                {this.renderListView()}
            </ScrollView>
            );
        // if (!this.state.loaded) {
        //     return this.renderLoadingView();
        // }
        // if(this.state.list.length == 0){
        //     return this.renderEmptyView();
        // }
        // return this.renderListView();
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Image source={require('../../../images/empty/no_file_gray.png')} />
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        您还没有附件
                </Text>
            </View>
        )
    },
    renderListView: function(){
        if (!this.state.list || this.state.list.length == 0) {
            // return this.renderEmptyRow();
            return false;
        };
        return (
            <View style={commonStyle.section}>
                <Text style={commonStyle.settingGroupsTitle}>附件</Text>
                <CollectionView
                    items={this.state.list}
                    itemsPerRow={2}
                    renderItem={this.renderRow} />
            </View>
            )
    },
    renderEmptyView: function(){
        var self = this;
        var rights = appConstants.userRights.rights;
        var targetRights = 8;
        if ((rights & targetRights) == targetRights){
            return (
                <View style={commonStyle.emptyView}>
                    <Image source={require('../../../images/empty/no_file_gray.png')} />
                    <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                            您还没有附件
                    </Text>
                    <Button
                    style={commonStyle.blueButton}
                    onPress={this.props.onEmptyButtonPress} >
                        添加附件
                    </Button>
                </View>
                );
        }else{
            return(
                <View style={styles.empty}>
                </View>
                )
        }
    },
    renderLoadingView: function(){
        return (
            <View style={commonStyle.container}>
                <ActivityIndicatorIOS
                    animating={!this.state.loaded}
                    style={[styles.activityIndicator, {height: 80}]}
                    size="large" />
            </View>
        );
    }
});

var styles = StyleSheet.create({
    main:{
        flex:1
    },
    empty:{
        justifyContent: 'center',
        alignItems: 'center'
    }
});