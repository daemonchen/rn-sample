'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var moment = require('moment');
var underscore = require('underscore');
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    Navigator,
    TouchableOpacity,
    TouchableHighlight,
    StyleSheet
} = React
/*
orderStatus:enum
1: create
2: update
3: normal
*/
var commonStyle = require('../../styles/commonStyle');

var DatePicker = require('../datePicker');
var Calendar = require('../calendar');
var Contact = require('../contact/contact');
var CustomerList = require('../contact/customerList');
var CompanyMemberList = require('../contact/companyMemberList');
var OrderTemplates = require('./orderTemplates');
var OrderTemplateSetting = require('./templates/orderTemplateSetting');

var BlueBackButton = require('../../common/blueBackButton');
var LeftCloseButton = require('../../common/leftCloseButton');
var RightDoneButton = require('../../common/rightDoneButton');

var orderAction = require('../../actions/order/orderAction');
var orderStore = require('../../stores/order/orderStore');
var orderListAction = require('../../actions/order/orderListAction');
var orderListStore = require('../../stores/order/orderListStore');
var attachAction = require('../../actions/attach/attachAction');
var attachStore = require('../../stores/attach/attachStore');

var util = require('../../common/util');

var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;

        var defaultData = this.props.route.data || {};
        var endTime = defaultData.endTime || new Date().valueOf();
        return {
            orderId: defaultData.id || 0,
            orderStatus: defaultData.orderStatus || 3,
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
            title: defaultData.title || ''

        }
    },
    componentDidMount: function(){
        this.unlisten = orderStore.listen(this.onChange);
        this.unlistenAttach = attachStore.listen(this.onAttachChange);
        this.unlistenOrderList = orderListStore.listen(this.onOrderlistChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.unlistenAttach();
        this.unlistenOrderList();
    },
    onOrderlistChange: function(){
        var result = orderListStore.getState();
        if (result.status != 200 && !!result.message) {
            return;
        }
        if (result.type == 'delete') {
            _navigator.pop();
        };
    },
    onAttachChange: function(){
        var result = attachStore.getState();
        if (result.status != 200 && !!result.message) {
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
            _navigator.pop();
        };
        if (result.type == 'update') {
            _navigator.pop();
        };
    },
    onCalendarPressDone: function(date){
        this.setState({
            endTime: moment(date).valueOf(),
            endTimeFormat: moment(date).format('YYYY年MM月DD日')
        });
    },
    _setEndTime: function(){
        _navigator.push({
            component: Calendar,
            target: 2,
            onCalendarPressDone: this.onCalendarPressDone,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
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
        _navigator.push({
            title:'选择客户',
            component: CustomerList,
            target: 2,
            onPressContactRow: this.onGetCustomer,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    _setSales: function(){
        _navigator.push({
            title:'业务员',
            component: CompanyMemberList,
            target: 2,
            onPressContactRow: this.onGetSales,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
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
            attachAction.create(fileObj);
        });
    },
    _selectTemplate: function(){
        _navigator.push({
            target: 1,
            component: OrderTemplates,
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            topNavigator: _topNavigator
        });
    },
    onPressDone: function(){
        if (this.state.orderStatus == 2) {//修改订单
            orderAction.update({
                id: this.state.orderId,
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
        }
        if (this.state.orderStatus == 1) {//新增订单
            orderAction.create({
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
                    title={{title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                );
        };
        return(
            <NavigationBar
                title={{title: this.props.route.title}}
                leftButton={<LeftCloseButton navigator={_topNavigator} />}
                rightButton={<RightDoneButton onPress={this.onPressDone} />} />
            );
    },
    _saveTemplate: function(){
        _navigator.push({
            title: '保存为模版',
            target: 1,
            component: OrderTemplateSetting,
            data: this.props.route.data,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
        // orderAction.save()
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
                            style={commonStyle.settingDetail}>
                            {this.state.creatorName}
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
                            style={commonStyle.settingDetail}>
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this._deleteOrder} >
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]} >
                            <Text
                            style={[commonStyle.settingTitle, commonStyle.red]}>
                                删除
                            </Text>
                            <Text
                            style={commonStyle.settingDetail}>
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
                    source={require('../../images/common/arrow_right.png')} />
                </View>
            </TouchableHighlight>
            )
    },
    render: function(){
        return(
            <ScrollView keyboardShouldPersistTaps={false}
            keyboardDismissMode={'interactive'}
            style={commonStyle.container}>
                {this.renderNavigationBar()}
                <View style={styles.main}>
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
                            source={require('../../images/common/arrow_right.png')} />
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
                            source={require('../../images/common/arrow_right.png')} />
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
                            source={require('../../images/common/arrow_right.png')} />
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
                            source={require('../../images/common/arrow_right.png')} />
                        </View>
                    </TouchableHighlight>
                    {this.renderOptionalSettings()}
                </View>
            </ScrollView>
            );
    }
});

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});