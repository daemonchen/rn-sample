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
        Actions.orderSheet();
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
                tintColor="#f9f9f9"
                title={{ title: '工作台' }} />
            );
    },
    renderPie: function(){
        var config = {
          dataSets: [{
            // values: [16,24,60],
            values: [60],
            drawValues: false,
            // colors: ['#98ebec', '#fec2bf', '#bdd3f7'],
            colors: ['#98ebec'],
            // sliceSpace: 2,
            sliceSpace: 0,
            selectionShift: 10.0
            // label: 'Quarter Revenues 2014'
          }],
          backgroundColor: 'transparent',
          // labels: ['已完成', '延期', '进行中'],
          // labels: ['已完成'],
          centerText: '0 \n 本月订单',
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
                                23
                            </Text>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
            </View>
        );
    }
})