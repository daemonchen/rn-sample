'use strict';
var React = require('react-native')
import NavigationBar from '../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var moment = require('moment');
var underscore = require('underscore');
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet
} = React

var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');

var Calendar = require('../calendar');
var Contact = require('../contact/contact');
// var OrderTemplates = require('./orderTemplates');
var OrderTemplateSetting = require('./templates/orderTemplateSetting');
var CustomerList = require('../contact/customerList');
var CompanyMemberList = require('../contact/companyMemberList');

var BlueBackButton = require('../../common/blueBackButton');
var LeftCloseButton = require('../../common/leftCloseButton');
var RightDoneButton = require('../../common/rightDoneButton');

var orderAction = require('../../actions/order/orderAction');
var orderStore = require('../../stores/order/orderStore');
var orderListAction = require('../../actions/order/orderListAction');
// var orderListStore = require('../../stores/order/orderListStore');
var attachAction = require('../../actions/attach/attachAction');
var attachStore = require('../../stores/attach/attachStore');

var util = require('../../common/util');

/*--从模版新建订单，设置页面--*/
module.exports = React.createClass({
    getInitialState: function(){

        var defaultData = this.props.data || {};
        var endTime = defaultData.endTime || new Date().valueOf();
        console.log('------template data:', defaultData);
        return {
            templateId: defaultData.templateId || null,
            accessoryIds: defaultData.accessoryIds || [],
            accessoryNum: defaultData.accessoryNum || '',
            creatorId: defaultData.creatorId || 0,
            creatorName: defaultData.creatorName || '',
            customerId: defaultData.customerId || '',
            customerName: defaultData.customerName || '',
            description: defaultData.description || '',
            endTime: endTime,
            endTimeFormat: moment(endTime).format('YYYY年MM月DD日'),
            factoryId: defaultData.factoryId || 0,
            lable: defaultData.lable || '',
            salesManId: defaultData.salesManId || '',
            salesManName: defaultData.salesManName || '',
            startTime: defaultData.startTime || '',
            title: defaultData.templateName || ''

        }
    },
    componentDidMount: function(){
        this.unlisten = orderStore.listen(this.onChange);
        this.unlistenAttach = attachStore.listen(this.onAttachChange);
        // this.unlistenOrderList = orderListStore.listen(this.onOrderlistChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenAttach();
        // this.unlistenOrderList();
    },
    // onOrderlistChange: function(){
    //     var result = orderListStore.getState();
    //     if (result.status != 200 && !!result.message) {
    //         return;
    //     }
    //     if (result.type == 'delete') {
    //         Actions.pop();
    //     };
    // },
    onAttachChange: function(){
        var result = attachStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            // this.fetchData();
            this.setAccessoryIds(result.data);
        };
    },
    setAccessoryIds: function(data){
        this.accessoryIds = this.state.accessoryIds;
        if (!data || !data.id) { return; };
        if (!underscore.contains(this.accessoryIds, data.id)) {
            this.accessoryIds.push(data.id);
        }
        this.setState({
            accessoryIds: this.accessoryIds,
            accessoryNum: this.accessoryIds.length
        });
    },
    onChange: function(){
        var result = orderStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (result.type == 'create') {
            Actions.pop(2);
        };
        if (result.type == 'update') {
            Actions.pop();
        };
    },
    onCalendarPressDone: function(date){
        this.setState({
            endTime: moment(date).valueOf(),
            endTimeFormat: moment(date).format('YYYY年MM月DD日')
        });
    },
    _setEndTime: function(){
        Actions.calendar({
            target: 2,
            onCalendarPressDone: this.onCalendarPressDone
        });
    },
    onGetCustomer: function(data){
        // customerId
        this.setState({
            customerId: data.userId,
            customerName: data.userName
        });
    },
    onGetSales: function(data){
        // salesManId
        this.setState({
            salesManId: data.userId,
            salesManName: data.userName
        });
    },
    _setCustomer: function(){
        Actions.customerList({
            title:'选择客户',
            target: 2,
            onPressContactRow: this.onGetCustomer
        });
    },
    _setSales: function(){
        Actions.companyMemberList({
            title:'业务员',
            target: 2,
            onPressContactRow: this.onGetSales,
        });
    },
    _addAttachs: function(){
        var params = {};
        params = {
            hostType: '1'
        }
        util.showPhotoPicker({
            title: ''
        }, (response)=>{
            var name = response.uri.substring(response.uri.lastIndexOf('/') + 1)
            var uri = response.uri.replace('file://', '');
            var fileObj = Object.assign({
                count:1,
                fileOrgName: name,
                uri: uri
            }, params);
            attachAction.create(fileObj);
        });
    },
    _selectTemplate: function(){
        Actions.pop();
    },
    onPressDone: function(){
        orderAction.create({
            templateId: this.state.templateId,
            accessoryIds: this.state.accessoryIds || [],
            accessoryNum: this.state.accessoryNum || '',
            creatorId: this.state.creatorId || 0,
            creatorName: this.state.creatorName || '',
            customerId: this.state.customerId || '',
            customerName: this.state.customerName || '',
            description: this.state.description || '',
            endTime: this.state.endTime || new Date().valueOf(),
            factoryId: this.state.factoryId || 0,
            lable: this.state.lable || '',
            salesManId: this.state.salesManId || '',
            salesManName: this.state.salesManName || '',
            startTime: this.state.startTime || '',
            title: this.state.title || ''
        });
    },
    onChangeNameText: function(text){
        this.setState({
            title: text
        });
    },
    onChangeDescribeText: function(text){
        this.setState({
            description: text
        });
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                title={{title: this.props.title}}
                leftButton={<BlueBackButton />}
                rightButton={<RightDoneButton onPress={this.onPressDone} />} />
            );
    },
    _saveTemplate: function(){
        Actions.orderTemplateSetting({
            title: '保存为模版',
            data: this.props.data
        });
    },


    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={styles.main}
                contentContainerStyle={{alignItems: 'center'}}
                keyboardShouldPersistTaps={false}
                keyboardDismissMode={'interactive'}>
                    <View style={commonStyle.centerWrapper}>
                        <View style={commonStyle.textInputWrapper}>
                            <TextInput placeholder='订单名称'
                            style={commonStyle.textInput}
                            clearButtonMode={'while-editing'}
                            value={this.state.title}
                            onChangeText={this.onChangeNameText}/>
                        </View>
                        <View style={commonStyle.textAreaWrapper}>
                            <TextInput placeholder='订单描述'
                            style={commonStyle.textArea}
                            clearButtonMode={'while-editing'}
                            multiline={true}
                            value={this.state.description}
                            onChangeText={this.onChangeDescribeText} />
                        </View>
                    </View>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._setEndTime} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                截止日期
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.endTimeFormat}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._setCustomer} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                客户
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.customerName}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._setSales} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                业务员
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.salesManName}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._addAttachs} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                添加附件
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
                                {this.state.accessoryNum}
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
});
