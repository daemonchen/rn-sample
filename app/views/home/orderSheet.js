'use strict';

import React, {
    View,
    Text,
    ActionSheetIOS,
    ScrollView,
    TouchableHighlight,
    Image,
    StyleSheet
} from 'react-native'
import NavigationBar from '../../common/react-native-navbar/index';

import { PieChart } from 'react-native-ios-charts';

var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');

var RightAddButton = require('../../common/rightAddButton');

var appConstants = require('../../constants/appConstants');
var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/home/style');
var util = require('../../common/util');

var taskListStore = require('../../stores/task/taskListStore');
var schemeStore = require('../../stores/scheme/schemeStore');

module.exports =  React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            config: {
                dataSets: [{
                    values: [0.14, 0.14, 0.34, 0.38],
                    colors: ['rgb(197, 255, 140)', 'rgb(255, 247, 140)', 'rgb(255, 210, 141)', 'rgb(140, 235, 255)'],
                    label: 'Quarter Revenues 2014'
                }],
                backgroundColor: 'transparent',
                labels: ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
                centerText: 'Quartely Revenue',
                legend: {
                    position: 'aboveChartRight',
                    wordWrap: true
                },
                valueFormatter: {
                    type: 'regular',
                    numberStyle: 'PercentStyle',
                    maximumDecimalPlaces: 0
                }
            }
        }
    },
    componentDidMount: function(){
        this.unlisten = taskListStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },

    handleUpdate: function(result){
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
    },
    onChange: function() {
        var result = taskListStore.getState();
        switch(result.type){
            case 'update':
                return this.handleUpdate(result);
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
        console.log('---go sheet');
    },
    goTask: function(){
        Actions.myTask();
    },
    renderNavigationBar: function(){
        // var rights = appConstants.userRights.rights;
        // var targetRights = 2;
        // if ((rights & targetRights) == targetRights) {
        //     return(
        //         <NavigationBar
        //             title={{ title: '工作台' }}
        //             rightButton={<RightAddButton onPress={this.showActionSheet} />} />
        //         );
        // }else{
        // }
        return(
            <NavigationBar
                style={{borderBottomWidth: 0}}
                tintColor="#f9f9f9"
                title={{ title: '工作台' }} />
            );
    },
    renderPieTitle: function(){
        return(
            <View>
                <Image />
                <Text>2016年3月</Text>
            </View>
            );
    },
    renderPie: function(){
        var config = {
          dataSets: [{
            values: [10,2,3],
            colors: ['#98ebec', '#fec2bf', '#bdd3f7'],
            sliceSpace: 2,
            selectionShift: 10.0
            // label: 'Quarter Revenues 2014'
          }],
          backgroundColor: 'transparent',
          // labels: ['已完成', '延期', '进行中'],
          centerText: '110 \n 本月订单',
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
          drawSliceTextEnabled: false
        };
        return (<PieChart config={config} style={styles.pieContainer}/>);
    },
    render:function(){
        return (
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.main}>
                    {this.renderPieTitle()}
                    {this.renderPie()}

                    <View style={styles.sepLine}/>

                </View>
            </View>
        );
    }
})