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
import moment from 'moment'
import { PieChart } from 'react-native-ios-charts';

var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');

var RightAddButton = require('../../common/rightAddButton');
var BlueBackButton = require('../../common/blueBackButton');

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
            runningCount: 0,
            currentTime: moment()
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
        workbenchReportAction.getMore({
            start: this.state.currentTime.startOf('month').valueOf(),
            end: this.state.currentTime.startOf('month').valueOf()
        });
    },
    handleGet: function(result){
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
            case 'getMore':
                return this.handleGet(result);
        }
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                leftButton={<BlueBackButton />}
                title={{ title: this.props.title }} />
            );
    },
    prev: function(){
        this.setState({
            currentTime: this.state.currentTime.subtract(1, 'M')
        });
        this.fetchData();
    },
    next: function(){
        this.setState({
            currentTime: this.state.currentTime.add(1, 'M')
        });
        this.fetchData();
    },
    renderPieTitle: function(){
        return(
            <View style={styles.pieTitle}>
                <TouchableOpacity
                style={styles.pieTitleBtnPrev}
                onPress={this.prev}>
                    <Image source={require('../../images/common/arrow_right_gray.png')}/>
                </TouchableOpacity>
                <Text style={styles.pieTitleText}>{this.state.currentTime.format('MM/YYYY')}</Text>
                <TouchableOpacity
                style={styles.pieTitleBtnNext}
                onPress={this.next}>
                    <Image source={require('../../images/common/arrow_right_gray.png')}/>
                </TouchableOpacity>
            </View>
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
          // labels: this.getPieLabels(),
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
    renderSheetFootItem: function(count, color, label){
        if (!count) {
            return(<View />);
        };
        return(
            <View
            style={commonStyle.settingItemWrapper}>
                <View
                style={commonStyle.settingItem}>
                    <View
                    style={[styles.sheetCircle, {backgroundColor: color}]}/>
                    <Text
                    style={commonStyle.settingTitle}>
                        {label}
                    </Text>
                    <Text
                    style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                        {count}
                    </Text>
                </View>
            </View>
            );
    },
    renderList: function(){
        return(
            <View style={styles.sheetList}>
                {this.renderSheetFootItem(this.state.runningCount, '#bdd3f7', '进行中订单')}
                {this.renderSheetFootItem(this.state.delayCount, '#fec2bf', '延期订单')}
                {this.renderSheetFootItem(this.state.finishedCount, '#98ebec', '已完成订单')}
            </View>
            );
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={styles.main}
                automaticallyAdjustContentInsets={false}>
                    {this.renderPieTitle()}
                    {this.renderPie()}

                    <View style={[styles.sepLine, {marginTop: 16}]}/>
                    {this.renderList()}
                </ScrollView>
            </View>
        );
    }
})