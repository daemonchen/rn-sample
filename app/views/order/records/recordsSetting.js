'use strict';
import React, {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    Navigator,
    TouchableOpacity,
    ActivityIndicatorIOS,
    StyleSheet
} from 'react-native'
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');

var RecordsList = require('../detail/recordsList');

var orderScheduleAction = require('../../../actions/order/orderScheduleAction');
var orderScheduleStore = require('../../../stores/order/orderScheduleStore');
var util = require('../../../common/util');
var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var contactsStyle = require('../../../styles/contact/contactsItem');

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            remark: '',
            scheduleCount: 0
        }
    },
    componentDidMount: function(){
        this.unlisten = orderScheduleStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        // this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    handleCreate: function(result){
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
        Actions.pop();
    },
    onChange: function() {
        var result = orderScheduleStore.getState();
        console.log('-------create report:', result);
        switch(result.type){
            case 'create':
                return this.handleCreate(result);
        }
    },
    doCreate: function() {
        orderScheduleAction.create({
            orderId: this.props.data.orderId,
            remark: this.state.remark,
            scheduleCount: this.state.scheduleCount
        });
    },
    onPressDone: function(){
        this.doCreate();
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor={'#f9f9f9'}
                title={{title: this.props.title}}
                leftButton={<BlueBackButton />}
                rightButton={<RightDoneButton onPress={this.onPressDone} />} />
            );
    },
    onChangeText: function(text){
        this.setState({
            scheduleCount: text
        });
    },
    onChangeDesText: function(text){
        this.setState({
            remark: text
        });
    },
    onSubmitDesEditing: function(){
        this.doCreate();
    },
    render: function() {
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView
                automaticallyAdjustContentInsets={false}
                style={styles.main}>
                    <TextInput
                    placeholder={'请输入进度'} style={styles.recordNum}
                    placeholderTextColor={'#4285f4'}
                    onChangeText={this.onChangeText}
                    keyboardType={'number-pad'}
                    returnKeyType={'next'}
                    autoFocus={true} />
                    <View style={styles.sepLine}/>
                    <View style={styles.summarySection}>
                        <Text style={[commonStyle.textDark, {paddingVertical: 10}]}>{this.props.data.title}</Text>
                        <Text style={[commonStyle.textGray, {paddingBottom: 10}]}>当前进度: {this.props.data.finishedQuantity}/{this.props.data.quantity}</Text>
                    </View>
                    <View style={styles.sepLine}/>
                    <TextInput
                    placeholder={'备注，可不填'} style={styles.recordsDesc}
                    placeholderTextColor={'#bdbdbd'}
                    onChangeText={this.onChangeDesText}
                    returnKeyType={'done'}
                    onSubmitEditing={this.onSubmitDesEditing} />
                </ScrollView>
            </View>
            );
    },
    onPressRow: function(data){
        this.props.onPressRow(data);
    },
    renderListView: function(){
        return (
            <RecordsList
                style={contactsStyle.scrollView}
                data={this.state.listData}
                onPressRow={this.onPressRow} />
            )
    },
    renderLoadingView: function(){
        return (
            <View style={commonStyle.header}>
                <Text style={commonStyle.headerText}>User List</Text>
                <View style={commonStyle.container}>
                    <ActivityIndicatorIOS
                        animating={!this.state.loaded}
                        style={[commonStyle.activityIndicator]}
                        size="small" />
                </View>
            </View>
        );
    }
});