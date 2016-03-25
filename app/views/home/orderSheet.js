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

var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');

var RightAddButton = require('../../common/rightAddButton');
var BlueBackButton = require('../../common/blueBackButton');

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
            pieValue: [10,2,3]
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
                tintColor="#f9f9f9"
                leftButton={<BlueBackButton />}
                title={{ title: '报表' }} />
            );
    },
    prev: function(){
        this.setState({
            pieValue: [Math.random()*20,12,Math.random()*3]
        });
    },
    next: function(){
        this.setState({
            pieValue: [Math.random(),12,3]
        });
    },
    renderPieTitle: function(){
        return(
            <View style={styles.pieTitle}>
                <TouchableOpacity
                style={styles.pieTitleBtnPrev}
                onPress={this.prev}>
                    <Image source={require('../../images/common/arrow_right_gray.png')}/>
                </TouchableOpacity>
                <Text style={styles.pieTitleText}>2016年3月</Text>
                <TouchableOpacity
                style={styles.pieTitleBtnNext}
                onPress={this.next}>
                    <Image source={require('../../images/common/arrow_right_gray.png')}/>
                </TouchableOpacity>
            </View>
            );
    },
    renderPie: function(){
        var config = {
          dataSets: [{
            values: this.state.pieValue,
            colors: ['#98ebec', '#fec2bf', '#bdd3f7'],
            sliceSpace: 2,
            selectionShift: 10.0
            // label: 'Quarter Revenues 2014'
          }],
          backgroundColor: 'transparent',
          // labels: ['已完成', '延期', '进行中'],
          centerText: '110 \n 本月订单',
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
    renderList: function(){
        return(
            <View style={styles.sheetList}>
                <View
                style={commonStyle.settingItemWrapper}>
                    <View
                    style={commonStyle.settingItem}>
                        <View
                        style={[styles.sheetCircle, styles.sheetCirclePurple]}/>
                        <Text
                        style={commonStyle.settingTitle}>
                            进行中订单
                        </Text>
                        <Text
                        style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                            23
                        </Text>
                    </View>
                </View>
                <View
                style={commonStyle.settingItemWrapper}>
                    <View
                    style={commonStyle.settingItem}>
                        <View
                        style={[styles.sheetCircle, styles.sheetCirclePink]}/>
                        <Text
                        style={commonStyle.settingTitle}>
                            延期订单
                        </Text>
                        <Text
                        style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                            23
                        </Text>
                    </View>
                </View>
                <View
                style={commonStyle.settingItemWrapper}>
                    <View
                    style={commonStyle.settingItem}>
                        <View
                        style={[styles.sheetCircle, styles.sheetCircleBlue]}/>
                        <Text
                        style={commonStyle.settingTitle}>
                            已完成订单
                        </Text>
                        <Text
                        style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                            23
                        </Text>
                    </View>
                </View>
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

                    <View style={styles.sepLine}/>
                    {this.renderList()}
                </ScrollView>
            </View>
        );
    }
})