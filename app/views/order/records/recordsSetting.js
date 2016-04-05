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
var TimerMixin = require('react-timer-mixin');

var RecordsList = require('../detail/recordsList');

var memberListAction = require('../../../actions/member/memberListAction');
var memberListStore = require('../../../stores/member/memberListStore');
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
        }
    },
    componentDidMount: function(){
        this.unlisten = memberListStore.listen(this.onChange);
        if (this._timeout) {
            this.clearTimeout(this._timeout)
        };
        // this._timeout = this.setTimeout(this.fetchData, 350)
    },
    componentWillUnmount: function() {
        this.unlisten();
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
            listData: result.data,
            loaded: true
        });
    },
    onChange: function() {
        var result = memberListStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        switch(result.type){
            case 'get':
                return this.handleGet(result);
        }
    },
    fetchData: function() {
        memberListAction.getList({
            orderId: this.props.data.orderId,
            pageNum: this.pageNum,
            pageSize: this.state.pageSize
        });
    },
    onPressDone: function(){
        console.log('---Todo');
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
    onChangeText: function(){
        console.log('---todo');
    },
    onSubmitEditing: function(){
        console.log('---todo');
    },
    onChangeDesText: function(){
        console.log('---todo');
    },
    onSubmitDesEditing: function(){
        console.log('---todo');
    },
    render: function() {
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView
                automaticallyAdjustContentInsets={false}
                style={styles.main}>
                    <TextInput value={'123'}
                    placeholder={'124'} style={styles.recordNum}
                    placeholderTextColor={'#4285f4'}
                    onChangeText={this.onChangeText}
                    keyboardType={'number-pad'}
                    returnKeyType={'next'}
                    onSubmitEditing={this.onSubmitEditing}
                    autoFocus={true} />
                    <View style={styles.sepLine}/>
                    <View style={styles.summarySection}>
                        <Text style={[commonStyle.textDark, {paddingVertical: 10}]}>阿斯顿发发</Text>
                        <Text style={[commonStyle.textGray, {paddingBottom: 10}]}>当前进度: 2/10</Text>
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