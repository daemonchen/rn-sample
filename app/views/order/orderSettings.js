'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    ScrollView,
    Image,
    Navigator,
    TouchableOpacity,
    StyleSheet
} = React
/*
orderStatus:enum
0: create
1: update
2: normal
*/
var commonStyle = require('../../styles/commonStyle');

var DatePicker = require('../datePicker');
var Calendar = require('../calendar');
var Contact = require('../contact/contact');
var Attach = require('./attach/attach');

var LeftCloseButton = require('../../common/leftCloseButton');
var RightDoneButton = require('../../common/rightDoneButton');

var orderAction = require('../../actions/order/orderAction');
var orderStore = require('../../stores/order/orderStore');

var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        var defaultData = this.props.route.data || {};
        return {
            orderStatus: defaultData.orderStatus || 0,
            accessoryIds: defaultData.accessoryIds || [],
            accessoryNum: defaultData.accessoryNum || '',
            creatorId: defaultData.creatorId || 0,
            creatorName: defaultData.creatorName || '',
            customerName: defaultData.customerName || '',
            description: defaultData.description || '',
            endTime: defaultData.endTime || new Date().valueOf(),
            factoryId: defaultData.factoryId || 0,
            lable: defaultData.lable || '',
            salesManId: defaultData.salesManId || '',
            startTime: defaultData.startTime || '',
            title: defaultData.title || ''

        }
    },
    componentDidMount: function(){
        this.unlisten = orderStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function(){
        var result = orderStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            _navigator.pop();
        };
    },
    _setEndTime: function(){
        _navigator.push({
            component: Calendar,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    _setCustomer: function(){
        _navigator.push({
            title:'客户',
            component: Contact,
            onPressContactRow: this.onPressContactRow,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    onPressContactRow: function(data){
        console.log('selected data:', data);
    },
    _addAttachs: function(){
        _navigator.push({
            title:'添加附件',
            component: Attach,
            sceneConfig: Navigator.SceneConfigs.FloatFromRight,
            topNavigator: _topNavigator
        });
    },
    onPressDone: function(){
        // _navigator.pop();
        orderAction.create({
            accessoryIds: this.state.accessoryIds || [],
            accessoryNum: this.state.accessoryNum || '',
            creatorId: this.state.creatorId || 0,
            creatorName: this.state.creatorName || '',
            customerName: this.state.customerName || '',
            description: this.state.description || '',
            endTime: this.state.endTime || new Date().valueOf(),
            factoryId: this.state.factoryId || 0,
            lable: this.state.lable || '',
            salesManId: this.state.salesManId || '',
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
    render: function(){
        return(
            <ScrollView keyboardShouldPersistTaps={false}
            style={commonStyle.container}>
                <NavigationBar
                    title={{title:'订单'}}
                    leftButton={<LeftCloseButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='订单名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeNameText}/>
                    </View>
                    <View style={commonStyle.textAreaWrapper}>
                        <TextInput placeholder='订单描述'
                        style={commonStyle.textArea}
                        clearButtonMode={'while-editing'}
                        multiline={true}
                        onChangeText={this.onChangeDescribeText} />
                    </View>
                    <TouchableOpacity
                    style={[commonStyle.settingItem, commonStyle.bottomBorder]}
                    onPress={this._setEndTime}>
                        <Text
                        style={commonStyle.settingTitle}>
                            截止日期
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                            2015年x月x日
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/common/arrow_right.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[commonStyle.settingItem, commonStyle.bottomBorder]}
                    onPress={this._setCustomer}>
                        <Text
                        style={commonStyle.settingTitle}>
                            客户
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                            我是xx
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/common/arrow_right.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[commonStyle.settingItem, commonStyle.bottomBorder]}
                    onPress={this._setCustomer} >
                        <Text
                        style={commonStyle.settingTitle}>
                            业务员
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                            阿斯顿发
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/common/arrow_right.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[commonStyle.settingItem, commonStyle.bottomBorder]}
                    onPress={this._addAttachs}>
                        <Text
                        style={commonStyle.settingTitle}>
                            添加附件
                        </Text>
                        <Text
                        style={commonStyle.settingDetail}>
                        </Text>
                        <Image
                        style={commonStyle.settingArrow}
                        source={require('../../images/common/arrow_right.png')} />
                    </TouchableOpacity>
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