'use strict';
var React = require('react-native')
import NavigationBar from '../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var moment = require('moment');
var underscore = require('underscore');
var TimerMixin = require('react-timer-mixin');
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    AlertIOS,
    StyleSheet
} = React
/*
orderStatus:enum
1: create
2: update
3: normal
*/
var commonStyle = require('../../styles/commonStyle');
var styles = require('../../styles/order/orderDetail');

// var Calendar = require('../calendar');
// var Contact = require('../contact/contact');
var CustomerList = require('../contact/customerList');
// var CompanyMemberList = require('../contact/companyMemberList');
// var OrderTemplates = require('./orderTemplates');
// var OrderTemplateSetting = require('./templates/orderTemplateSetting');

var BlueBackButton = require('../../common/blueBackButton');
var LeftCloseButton = require('../../common/leftCloseButton');
var RightDoneButton = require('../../common/rightDoneButton');
var LoadingOverlay = require('../../common/loadingOverlay');

var orderAction = require('../../actions/order/orderAction');
var orderStore = require('../../stores/order/orderStore');
var orderListAction = require('../../actions/order/orderListAction');
var orderListStore = require('../../stores/order/orderListStore');
var attachAction = require('../../actions/attach/attachAction');
var attachStore = require('../../stores/attach/attachStore');

var util = require('../../common/util');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){

        var defaultData = this.props.data || {};
        var endTime = defaultData.endTime || new Date().valueOf();
        return {
            isVisible: false,
            orderId: defaultData.orderId || 0,
            orderStatus: defaultData.orderStatus || 1
        }
    },
    componentDidMount: function(){
        this.unlisten = orderStore.listen(this.onChange);
        this.unlistenAttach = attachStore.listen(this.onAttachChange);
        this.unlistenOrderList = orderListStore.listen(this.onOrderlistChange);
        if (this._timeout) {this.clearTimeout(this._timeout)};
        this._timeout = this.setTimeout(this.fetchData, 350);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenAttach();
        this.unlistenOrderList();
    },
    fetchData: function(){
        if (!this.state.orderId) {return;};
        orderAction.get({
            orderId: this.state.orderId
        });
    },
    onOrderlistChange: function(){
        var result = orderListStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (result.type == 'delete') {
            Actions.pop(2);
        };
    },
    onAttachChange: function(){
        var result = attachStore.getState();
        this.setState({
            isVisible: false
        });
        // console.log('-----attachStore result:', result);
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            // this.fetchData();
            this.setAccessoryNum(result.data);
        };
    },
    setAccessoryNum: function(data){
        // this.accessoryIds = this.state.accessoryIds;
        if (!data || !data.id) { return; };
        // if (!underscore.contains(this.accessoryIds, data.id)) {
        //     this.accessoryIds.push(data.id);
        // }
        this.setState({
            accessoryNum: this.state.accessoryNum + 1
        });
    },
    transformData: function(result){
        // console.log('-----result', result);
        var defaultData = result.data;
        var endTime = defaultData.endTime || new Date().valueOf();
        this.setState({
            // accessoryIds: defaultData.accessoryIds || [],
            accessoryNum: defaultData.accessoryNum || '',
            creatorId: defaultData.creatorId || 0,
            userName: defaultData.userName || '',
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
            title: defaultData.title || '',
            quantity: defaultData.quantity || ''
        });
    },
    onChange: function(){
        var result = orderStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (result.type == 'create') {
            Actions.orderDetailReplace({
                data: result.data
            });
            // Actions.pop();
        };
        if (result.type == 'update') {
            Actions.pop();
        };
        if (result.type == 'get') {
            this.transformData(result);
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
    onQuantityPressDone: function(num){
        this.setState({
            quantity: num
        });
    },
    _setQuantity: function(){
        console.log('-----order data:', this.props.data);
        Actions.orderQuantitySetting({
            data: this.props.data,
            onQuantityPressDone: this.onQuantityPressDone
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
            onPressContactRow: this.onGetSales
        });
    },
    _addAttachs: function(){
        var params = {};
        if (this.state.orderStatus == 1) {//如果是创建订单，则没有订单号字段
            params = {
                hostType: '1'
            }
        }else{
            params = {
                hostId: this.state.orderId + '',
                hostType: '1'
            }
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
            this.doConfirm(fileObj);
        });
    },
    doConfirm: function(fileObj){
        AlertIOS.alert(
            '',
            '您确定要上传附件吗',
            [
                {text: '确定', onPress: () => {
                    attachAction.create(fileObj);
                    this.setState({
                        isVisible: true
                    });
                } },
                {text: '取消', onPress: () => {return}, style: 'cancel'},
            ]
        )
    },
    _selectTemplate: function(){
        Actions.orderTemplates({
            target: 1
        });
    },
    onPressDone: function(){
        if (this.state.orderStatus == 2) {//修改订单
            orderAction.update({
                id: this.state.orderId,
                // accessoryIds: this.state.accessoryIds || [],
                accessoryNum: this.state.accessoryNum || '',
                creatorId: this.state.creatorId || 0,
                userName: this.state.userName || '',
                customerId: this.state.customerId || '',
                customerName: this.state.customerName || '',
                description: this.state.description || '',
                endTime: this.state.endTime || new Date().valueOf(),
                factoryId: this.state.factoryId || 0,
                lable: this.state.lable || '',
                salesManId: this.state.salesManId || '',
                salesManName: this.state.salesManName || '',
                startTime: this.state.startTime || '',
                title: this.state.title || '',
                quantity: this.state.quantity || ''
            });
        }
        if (this.state.orderStatus == 1) {//新增订单
            orderAction.create({
                // accessoryIds: this.state.accessoryIds || [],
                accessoryNum: this.state.accessoryNum || '',
                creatorId: this.state.creatorId || 0,
                userName: this.state.userName || '',
                customerId: this.state.customerId || '',
                customerName: this.state.customerName || '',
                description: this.state.description || '',
                endTime: this.state.endTime || new Date().valueOf(),
                factoryId: this.state.factoryId || 0,
                lable: this.state.lable || '',
                salesManId: this.state.salesManId || '',
                salesManName: this.state.salesManName || '',
                startTime: this.state.startTime || '',
                title: this.state.title || '',
                quantity: this.state.quantity || ''
            });
        };
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
        if (this.state.orderStatus == 2) {//修改订单
            return(
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: this.props.title}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                );
        };
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                title={{title: this.props.title}}
                leftButton={<LeftCloseButton />}
                rightButton={<RightDoneButton onPress={this.onPressDone} />} />
            );
    },
    _saveTemplate: function(){
        Actions.orderTemplateSetting({
            title: '保存为模版',
            target: 1,
            data: this.props.data
        });
    },
    _deleteOrder: function(){
        orderListAction.delete({
            orderId: this.state.orderId
        })
    },
    renderOptionalSettings: function(){
        if (this.state.orderStatus == 2) {//修改订单
            return(
                <View>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee' >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                创建者
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                            {this.state.userName}
                            </Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._saveTemplate} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                保存为模版
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._deleteOrder} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.red, {textAlign: 'center'}]}>
                                删除
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>
                );
        };
        return(
            <TouchableHighlight
                style={commonStyle.settingItemWrapper}
                underlayColor='#eee'
                onPress={this._selectTemplate} >
                <View
                style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                    <Text
                    style={commonStyle.settingTitle}>
                        从模版创建
                    </Text>
                    <Text
                    style={commonStyle.settingDetail}>
                    </Text>
                    <Image
                    style={commonStyle.settingArrow}
                    source={require('../../images/common/arrow_right_gray.png')} />
                </View>
            </TouchableHighlight>
            )
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
                            <TextInput placeholder={'订单名称'}
                            style={commonStyle.textInput}
                            clearButtonMode={'while-editing'}
                            value={this.state.title}
                            onChangeText={this.onChangeNameText}/>
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
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
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
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
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
                        onPress={this._setQuantity} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={commonStyle.settingTitle}>
                                订单数量
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                                {this.state.quantity}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                    <View style={[commonStyle.textAreaWrapper, {marginTop: 32, borderBottomWidth: 0}]}>
                        <TextInput placeholder={'请输入订单描述，可不填'}
                        style={commonStyle.textArea}
                        clearButtonMode={'while-editing'}
                        returnKeyType={'done'}
                        multiline={true}
                        value={this.state.description}
                        onChangeText={this.onChangeDescribeText} />
                    </View>
                    <View style={commonStyle.settingItemWrapper} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={[commonStyle.settingTitle, commonStyle.textGray]}>
                                更多内容
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                            </Text>
                        </View>
                    </View>
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
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
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
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                                {this.state.accessoryNum}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                    {this.renderOptionalSettings()}
                </ScrollView>
                 <LoadingOverlay isVisible={this.state.isVisible} />
            </View>
            );
    }
});
