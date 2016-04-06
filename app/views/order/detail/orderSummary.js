'use strict';

import React, {
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
} from 'react-native'
import NavigationBar from 'react-native-navbar'
import { PieChart } from 'react-native-ios-charts';
import TimerMixin from 'react-timer-mixin';
import _ from 'underscore';
import moment from 'moment'

var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');


var attachListStore = require('../../../stores/attach/attachListStore');
var attachListAction = require('../../../actions/attach/attachListAction');
var attachStore = require('../../../stores/attach/attachStore');

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

var appConstants = require('../../../constants/appConstants');

// var AttachItem = require('./attachItem');
var Button = require('../../../common/button.js');
var util = require('../../../common/util');
var CollectionView = require('../../../common/collectionView');
var RecordsList = require('./recordsList');

module.exports = React.createClass({
    mixins: [TimerMixin],
    dayOfWeek: ['周日','周一','周二','周三','周四','周五','周六'],
    getInitialState: function(){
        return {
            loaded : false,
            list: []
        }
    },
    componentDidMount: function() {
        this.unlistenAttach = attachStore.listen(this.onAttachChange);
        this.unlisten = attachListStore.listen(this.onChange);
        // this.fetchAttachData();
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
    },
    handleGet: function(result){
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
        if (!this.props.data.descriptionUrl || (this.props.data.descriptionUrl.length == 0)) {
            util.toast('暂无更多描述');
            return;
        };
        Actions.taskDescribe({
            title: '订单描述',
            descriptionUrl: this.props.data.descriptionUrl
        });
    },
    fetchAttachData: function(){
        attachListAction.getList({
            hostId: this.props.data.orderId,
            hostType: 1//订单附件
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
    renderDescribeItem: function(){
        // console.log('------this.props.data', this.props.data);
        if (!this.props.data.hadDes) {
            return(
                <View />);
        };
        return(
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
                    source={require('../../../images/common/arrow_right_gray.png')} />
                </View>
            </TouchableHighlight>
            );
    },
    getPieValue: function(){
        var res = [];
        if (!!this.props.data.finishedQuantity) {
            res.push(this.props.data.finishedQuantity);
        };
        var runningCount = this.props.data.quantity - this.props.data.finishedQuantity;
        if (runningCount > 0) {
            res.push(runningCount);
        };
        if (res.length == 0) {//没有数据的情况下
            res.push(100);
        };
        return res;

    },
    getPieColors: function(){
        var res = [];
        if (!!this.props.data.finishedQuantity) {
            res.push('#4285f4');
        };
        var runningCount = this.props.data.quantity - this.props.data.finishedQuantity;
        if (runningCount > 0) {
            res.push('#d5d5d5');
        };
        if (res.length == 0) {//没有数据的情况下
            res.push('#d5d5d5');
        };
        return res;
    },
    getPieCenterText: function(){
        if (this.getPieColors()[0] == '#d5d5d5') {
            return '无生产进度'
        };
        return this.props.data.finishedQuantity + '/' + this.props.data.quantity + ' \n 生产进度';
    },
    renderPie: function(){
        // console.log('----pie data:', this.props.data);
        if (!!this.props.isLoad) {//
            return(<View style={styles.pieContainer}/>);
        };
        var config = {
          dataSets: [{
            values: this.getPieValue(),
            drawValues: !(this.getPieColors()[0] == '#d5d5d5'),
            colors: this.getPieColors(),
            sliceSpace: 0,
            selectionShift: 10.0
            // label: 'Quarter Revenues 2014'
          }],
          backgroundColor: 'transparent',
          centerText: this.getPieCenterText(),
          rotationWithTwoFingers: true,
          legend: {
            position: 'belowChartCenter',
            wordWrap: true
          },
          valueFormatter: {
            type: 'regular',
            numberStyle: 'NoStyle',
            maximumDecimalPlaces: 0
          },
          holeRadiusPercent: 0.72,
          drawSliceTextEnabled: false,
          animation: {
            yAxisDuration: 0.8,
            easingOption: 'easeInOutQuad'
          }
        };
        return (<PieChart config={config} style={styles.pieContainer}/>);
    },
    renderBarItem: function(item, key, height){
        console.log('----bar item', item);
        if (key == 0) {
            return(
                <View style={[styles.barItemWrapper, {marginLeft: 0}]} key={key}>
                    <Text style={[commonStyle.textDark, styles.barItemText]}>{item.dayOfWeek}</Text>
                    <Text style={[commonStyle.textGray, styles.barItemText]}>{item.formatDay}</Text>
                    <Text style={[{position: 'absolute', bottom: height}, styles.barItemText]}>{item.count}</Text>
                    <View style={[styles.barItem,{height: height}]} />
                </View>
                );
        };
        return(
            <View style={styles.barItemWrapper} key={key}>
                <Text style={[commonStyle.textDark, styles.barItemText]}>{item.dayOfWeek}</Text>
                <Text style={[commonStyle.textGray, styles.barItemText]}>{item.formatDay}</Text>
                <Text style={[{position: 'absolute', bottom: height}, styles.barItemText]}>{item.count}</Text>
                <View style={[styles.barItem, {height: height}]} />
            </View>
            );
    },
    renderBarItems: function(){
        // console.log('----schedules', this.props.data.schedules);
        var self = this;
        var barDataArray = this.getBarData();
        // console.log('----barDataArray', barDataArray);
        var maxValue = _.max(barDataArray, function(item){ return item.count}).count;
        return _.map(barDataArray, function(item, key){
            var height = parseInt(200 * (item.count/maxValue));
            console.log('---height', height, maxValue);
            return self.renderBarItem(item, key, height);
        });
    },
    renderBarChart: function(){
        return(
            <View style={styles.barChartContainer}>
                {this.renderBarItems()}
            </View>);
    },
    getDay: function(date){
        if (moment().format('YYYY/MM/DD') == moment(date, 'MM/DD').format('YYYY/MM/DD')) {
            return '今天';
        };
        return this.dayOfWeek[moment(date, 'MM/DD').day()];
    },
    getBarData: function(){
        var  res = [];
        var _data = this.props.data.schedules;
        _.map(_data, function(item, key){//format all date as month/day
            item.formatDay = moment(item.date).format('MM/DD');
            return item;
        });
        var daysArray = _.uniq(_.pluck(_data, 'formatDay'));
        var sliceArray = daysArray.slice(0,7);//get the latest seven days
        for (var i = 0; i < sliceArray.length; i++) {
            var item = {
                formatDay: sliceArray[i],
                dayOfWeek: this.getDay(sliceArray[i]),
                count: 0
            }
            for (var j = 0; j < _data.length; j++) {
                if (_data[j].formatDay == sliceArray[i]) {
                    item.count += _data[j].count;
                };
            };
            res.unshift(item);
        };
        return res;
    },
    goRecordsList: function(){
        Actions.recordsList({
            data: this.props.data
        });
    },
    render: function() {
        return(
            <ScrollView style={styles.summaryWrapper}>
                <View style={commonStyle.section}>
                    {this.renderPie()}
                    {this.renderBarChart()}
                    <View style={commonStyle.settingItemWrapper}>
                        <View style={[commonStyle.settingItem]}>
                            <Text
                            numberOfLines={3}
                            style={[commonStyle.commonTitle, commonStyle.textGray,{flex: 1}]}>
                                进度记录
                            </Text>
                        </View>
                    </View>
                    {this.renderRecordsList()}
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goRecordsList}>
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            style={[commonStyle.blue, {flex: 1}]}>
                                查看更多
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goTask}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../../images/person/account_settings.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                业务员
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                                abc
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <View style={commonStyle.settingItemWrapper}>
                        <View style={[commonStyle.settingItem]}>
                            <Text
                            numberOfLines={3}
                            style={[commonStyle.commonTitle, commonStyle.textGray,{flex: 1}]}>
                                订单描述
                            </Text>
                        </View>
                    </View>
                    {this.renderDescribeItem()}
                    <View style={commonStyle.settingItemWrapper}>
                        <View style={[commonStyle.settingItem]}>
                            <Text
                            numberOfLines={3}
                            style={[commonStyle.commonTitle, commonStyle.textGray,{flex: 1}]}>
                                附件
                            </Text>
                        </View>
                    </View>
                    {this.renderListView()}
                </View>
            </ScrollView>
            );

    },
    renderRecordsList: function(){
        return (
            <RecordsList data={this.state.listData} />
            );
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
                    style={[styles.activityIndicator]}
                    size="small" />
            </View>
        );
    }
});
