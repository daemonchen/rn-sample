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
    WebView,
    StyleSheet
} from 'react-native'
import NavigationBar from '../../../common/react-native-navbar/index';
import { PieChart } from 'react-native-ios-charts';
import TimerMixin from 'react-timer-mixin';
import _ from 'underscore';
import moment from 'moment';
import WebViewBridge from 'react-native-webview-bridge';

var Actions = require('react-native-router-flux').Actions;
var SearchBar = require('react-native-search-bar');


// var attachListStore = require('../../../stores/attach/attachListStore');
// var attachListAction = require('../../../actions/attach/attachListAction');
// var attachStore = require('../../../stores/attach/attachStore');

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');

var appConstants = require('../../../constants/appConstants');

// var AttachItem = require('./attachItem');
var http = require('../../../common/http');
var Button = require('../../../common/button.js');
var util = require('../../../common/util');
// var CollectionView = require('../../../common/collectionView');
var RecordsListComponent = require('./recordsListComponent');

module.exports = React.createClass({
    mixins: [TimerMixin],
    dayOfWeek: ['周日','周一','周二','周三','周四','周五','周六'],
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        var accessoryData = this.props.data.accessories || [];
        return {
            loaded : false,
            webViewHeight: 100,
            list: accessoryData,
            dataSource: ds//附件数据源
        }
    },
    componentDidMount: function() {
        // this.unlistenAttach = attachStore.listen(this.onAttachChange);
        // this.unlisten = attachListStore.listen(this.onChange);
        // this.fetchAttachData();
    },
    componentWillUnmount: function(){
    // this.unlisten();
    // this.unlistenAttach()
    },
    componentWillReceiveProps: function(nextProps){
        var accessoryData = this.props.data.accessories || [];
        // console.log('--------init dataSource:', accessoryData);

        this.setState({
            list: accessoryData,
            dataSource: this.state.dataSource.cloneWithRows(accessoryData)
        });
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
    // fetchAttachData: function(){
    //     attachListAction.getList({
    //         hostId: this.props.data.orderId,
    //         hostType: 1//订单附件
    //     });
    // },
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
        // console.log('---------rowData', rowData);
        return(
            <TouchableOpacity onPress={()=>{this.onPressAttachRow(rowData)}} key={index}>
                <View style={commonStyle.collectionItem}>
                    <Image source={{uri: rowData.absoluteUrl}}
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
    injectedJavaScript: function(){
        return `
        var NzmJavascriptHandler = {
            imageZoom: function(imageSrc, imageSrcList){
                var obj = {
                    imageSrc: imageSrc,
                    imageSrcList: imageSrcList
                }
                WebViewBridge.send(JSON.stringify(obj));
            }
        };
        function webViewBridgeReady(cb) {
            //checks whether WebViewBirdge exists in global scope.
            if (window.WebViewBridge) {
                cb(window.WebViewBridge);
                return;
            }

            function handler() {
                //remove the handler from listener since we don't need it anymore
                document.removeEventListener('WebViewBridge', handler, false);
                //pass the WebViewBridge object to the callback
                cb(window.WebViewBridge);
            }

            //if WebViewBridge doesn't exist in global scope attach itself to document
            //event system. Once the code is being injected by extension, the handler will
            //be called.
            document.addEventListener('WebViewBridge', handler, false);
        }

        webViewBridgeReady(function (webViewBridge) {
            WebViewBridge.send(JSON.stringify({"webViewHeight": document.body.scrollHeight}));
            WebViewBridge.onMessage = function (message) {
              alert('got a message from Native: ' + message);
            };
        });
        `;
    },
    onBridgeMessage: function (obj) {
        // if (res) {};
        // console.log('-----webViewHeight', obj);
        var result = JSON.parse(obj);
        if (!!result.webViewHeight) {
            if (result.webViewHeight == this.state.webViewHeight) { return;};
            this.setState({webViewHeight: parseInt(result.webViewHeight)});
            return;
        };
        result.imageSrcList = util.parseStringToJson(result.imageSrcList);
        var index = 0;
        for (var i = 0; i < result.imageSrcList.length; i++) {
            (result.imageSrc == result.imageSrcList[i]) && (index = i);
        };
        Actions.imageSwiperPage({
            index: index,
            slides: result.imageSrcList || []
        });
    },
    renderDescribeItem: function(){
        // console.log('------this.props.data', this.props.data);
        var url = this.props.data.descriptionUrl + '?' + http.getWebViewUrlParams();
        // if (!this.props.data.hadDes) {
        //     return(
        //         <View />);
        // };
        if (!!this.props.data.descriptionUrl) {
            return(
                <View>
                    <View style={commonStyle.settingItemWrapper}>
                        <View style={[commonStyle.settingItem]}>
                            <Text
                            numberOfLines={3}
                            style={[commonStyle.commonTitle, commonStyle.textGray,{flex: 1}]}>
                                订单描述
                            </Text>
                        </View>
                    </View>
                    <WebViewBridge
                        source={{uri: url}}
                        automaticallyAdjustContentInsets={true}
                        style={[styles.descWrapper, {height: this.state.webViewHeight}]}
                        scrollEnabled={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        onBridgeMessage={this.onBridgeMessage}
                        injectedJavaScript={this.injectedJavaScript()}
                        scalesPageToFit={false} />
                </View>

                );
        };
        return(<View />);
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
        if (this.props.data.quantity == 0) {
            return(<View />);
        };
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
        // console.log('----bar item', item);
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
            var height = parseInt(85 * (item.count/maxValue));
            if (!height) {
                height = 0;
            };
            // console.log('---height', height, maxValue);
            return self.renderBarItem(item, key, height);
        });
    },
    renderBarChart: function(){
        if (this.props.data.quantity == 0) {
            return(<View />);
        };
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
        res = this.addMockData(res);
        return res;
    },
    addMockData: function(data){
        if (data.length == 0) {
            data[0] = {
                formatDay: moment().format('MM/DD'),
                dayOfWeek: this.getDay(moment()),
                count: 0
            }
        };
        if (data.length < 7) {
            var mockLength = 7 - data.length;
            var start = moment(data[0].formatDay, 'MM/DD');
            for (var i = 1; i <=mockLength; i++) {
                var currentDay = start.subtract(1, 'd');
                var item = {
                    formatDay: currentDay.format('MM/DD'),
                    dayOfWeek: this.getDay(currentDay),
                    count: 0
                }
                data.unshift(item);
            };
        };
        return data;
    },
    goRecordsList: function(){
        Actions.recordsList({
            data: this.props.data
        });
    },
    renderMoreButton: function(){
        if (!this.props.data.schedules || this.props.data.schedules.length == 0) {
            return(<View />);
        };
        return(
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
            );
    },
    renderSaleManInfo: function(){
        if(!this.props.data.salesManName){
            return(<View />);
        }
        return(
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
                        {this.props.data.salesManName}
                    </Text>
                </View>
            </TouchableHighlight>
            );
    },
    render: function() {
        // console.log('-----order data:', this.props.data);
        return(
            <ScrollView style={styles.summaryWrapper}>
                <View style={commonStyle.section}>
                    {this.renderPie()}
                    {this.renderBarChart()}

                    {this.renderRecordsList()}
                    {this.renderMoreButton()}
                    {this.renderSaleManInfo()}


                    {this.renderDescribeItem()}

                    {this.renderListView()}
                </View>
            </ScrollView>
            );

    },
    renderRecordsList: function(){
        // console.log('-----schedules in ordersummary:', this.props.data.schedules);
        return (
            <RecordsListComponent data={this.props.data.schedules}/>
            );
    },

    renderListView: function(){
        // console.log('---------order data:', this.props.data.accessories);
        console.log('-------list',this.state.list);
        if (!!this.state.list && this.state.list.length > 0) {
            var dataArray = this.state.dataSource.cloneWithRows(this.state.list);
            return (
                <View>
                    <View style={commonStyle.settingItemWrapper}>
                        <View style={[commonStyle.settingItem]}>
                            <Text
                            numberOfLines={3}
                            style={[commonStyle.commonTitle, commonStyle.textGray,{flex: 1}]}>
                                附件
                            </Text>
                        </View>
                    </View>
                    <ListView
                      style={commonStyle.section}
                      dataSource={dataArray}
                      renderRow={this.renderRow} />
                </View>
                )
        };
        return this.renderEmptyView();
            // <View style={commonStyle.section}>
            //     <CollectionView
            //         items={this.props.data.accessories}
            //         itemsPerRow={1}
            //         renderItem={this.renderRow} />
            // </View>
    },
    renderEmptyView: function(){
        return(
            <View style={styles.empty}>
            </View>
        )
    }
});
