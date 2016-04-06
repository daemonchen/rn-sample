'use strict';

import React, {
    View,
    Text,
    ActionSheetIOS,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Image,
    StyleSheet
} from 'react-native'
import NavigationBar from '../../common/react-native-navbar/index';

import { PieChart } from 'react-native-ios-charts';
import moment from 'moment'

var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');

var RightAddButton = require('../../common/rightAddButton');

var appConstants = require('../../constants/appConstants');
var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/home/style');
var util = require('../../common/util');

var workbenchReportAction = require('../../actions/workbench/workbenchReportAction');
var workbenchReportStore = require('../../stores/workbench/workbenchReportStore');

module.exports =  React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            isLoad: true,
            delayCount: 0,
            finishedCount: 0,
            runningCount: 0
        }
    },
    componentDidMount: function(){
        this.unlisten = workbenchReportStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(this.fetchData, 350);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    fetchData: function(){
        workbenchReportAction.get({
            start: moment().startOf('month').valueOf(),
            end: moment().startOf('month').valueOf()
        });
    },
    handleGet: function(result){
        // console.log('-------home sheet data:', result.data);
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            this.setState({
                isLoad: false
            });
            return;
        }
        this.setState({
            isLoad: false,
            delayCount: result.data.delayCount,
            finishedCount: result.data.finishedCount,
            runningCount: result.data.runningCount
        });
    },
    onChange: function() {
        var result = workbenchReportStore.getState();
        switch(result.type){
            case 'get':
                return this.handleGet(result);
        }
    },
    showActionSheet: function(){
        var self = this;
        ActionSheetIOS.showActionSheetWithOptions({
            options: this.actionList,
            cancelButtonIndex: 1,
            // destructiveButtonIndex: 1,
            },
            (buttonIndex) => {
              self.onSelectActionSheet(buttonIndex);
            });
    },
    actionList: ['新建订单','取消'],
    doPushOrderSetting: function(){
        Actions.orderSettings({
            title: '新建订单',
            data: {orderStatus: 1}
        });
    },
    onSelectActionSheet: function(index){
        switch(index){
            case 0:
                return this.doPushOrderSetting();
            default :
                return;
        }
    },
    goSheet: function(){
        Actions.orderSheet();
    },
    goTask: function(){
        Actions.myTask();
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                title={{ title: '工作台' }} />
            );
    },
    getPieValue: function(){
        var res = [];
        if (!!this.state.delayCount) {
            res.push(this.state.delayCount);
        };
        if (!!this.state.finishedCount) {
            res.push(this.state.finishedCount);
        };
        if (!!this.state.runningCount) {
            res.push(this.state.runningCount);
        };
        if (res.length == 0) {//没有数据的情况下
            res.push(100);
        };
        return res;

    },
    getPieColors: function(){
        var res = [];
        if (!!this.state.delayCount) {
            res.push('#fec2bf');
        };
        if (!!this.state.finishedCount) {
            res.push('#98ebec');
        };
        if (!!this.state.runningCount) {
            res.push('#bdd3f7');
        };
        if (res.length == 0) {//没有数据的情况下
            res.push('#d5d5d5');
        };
        return res;
    },
    getPieLabels: function(){
        var res = [];
        if (!!this.state.delayCount) {
            res.push('延期');
        };
        if (!!this.state.finishedCount) {
            res.push('已完成');
        };
        if (!!this.state.runningCount) {
            res.push('进行中');
        };
        // if (res.length == 0) {//没有数据的情况下
        //     res.push('#d5d5d5');
        // };
        return res;
    },
    getSliceSpace: function(){
        if (this.getPieValue().length > 1) {
            return 2
        };
        return 0;
    },
    getPieCenterText: function(){
        if (this.getPieColors()[0] == '#d5d5d5') {
            return '本月无数据'
        };
        var totalCount = this.state.delayCount + this.state.finishedCount + this.state.runningCount;
        return totalCount + ' \n 本月订单';
    },
    renderPie: function(){
        if (!!this.state.isLoad) {//
            return(<View style={styles.pieContainer}/>);
        };
        var config = {
          dataSets: [{
            values: this.getPieValue(),
            drawValues: !(this.getPieColors()[0] == '#d5d5d5'),
            colors: this.getPieColors(),
            // sliceSpace: 2,
            sliceSpace: this.getSliceSpace(),
            selectionShift: 10.0
            // label: 'Quarter Revenues 2014'
          }],
          backgroundColor: 'transparent',
          labels: this.getPieLabels(),
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
    render:function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={styles.main}
                automaticallyAdjustContentInsets={false}>
                    {this.renderPie()}
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goSheet}>
                        <View
                        style={commonStyle.settingItem}>
                            <Text
                            style={commonStyle.blue}>
                                查看更多报表...
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.sepLine}/>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goTask}>
                        <View
                        style={commonStyle.settingItem}>
                            <Image
                            style={commonStyle.settingIcon}
                            source={require('../../images/person/account_settings.png')}/>
                            <Text
                            style={commonStyle.settingTitle}>
                                我的任务
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>

                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );
    }
})