'use strict';

var React = require('react-native');
import NavigationBar from '../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Image,
    ScrollView,
    ListView,
    TouchableOpacity,
    TouchableHighlight,
    ActionSheetIOS,
    StyleSheet
} = React;

var commonStyle = require('../../styles/commonStyle');
var contactsStyle = require('../../styles/contact/contactsItem');

var ContactDetail = require('./contactDetail');
var ContactList = require('./contactList');

var Modal = require('../../common/modal');

var BlueBackButton = require('../../common/blueBackButton');
var RightAddButton = require('../../common/rightAddButton');
var RightMoreButton = require('../../common/rightMoreButton');

var factoryAction = require('../../actions/factory/factoryAction');
var factoryStore = require('../../stores/factory/factoryStore');
var employeeAction = require('../../actions/employee/employeeAction');
var employeeStore = require('../../stores/employee/employeeStore');

var util = require('../../common/util');
var Button = require('../../common/button.js');
var appConstants = require('../../constants/appConstants');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => true});
        return {
            dataSource: ds,
            list: [],
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = employeeStore.listen(this.onChange);
        if (this._timeout) {this.clearTimeout(this._timeout)};
        this._timeout = this.setTimeout(this.fetchData, 350);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },

    onChange: function() {
        var result = employeeStore.getState();
        if (result.type=="getApplcationList") {
            this.transformList(result);
        };
        if (result.type=="agreeApplication") {
            this.handleAgree(result);
        };

    },
    handleAgree: function(result){
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
        var currentList = this.state.list;
        //标记已加入
        for (var i = 0; i < currentList.length; i++) {
            (currentList[i].id == result.data) && (currentList[i].status = 2)
        };
        this.setState({
            list: currentList || [],
            dataSource : this.state.dataSource.cloneWithRows(currentList || [])
        });
    },
    transformList: function(result){
        console.log('---result', result);
        if (result.status != 200 && !!result.message) {
            util.toast(result.message);
            return;
        }
        this.setState({
            list: result.data || [],
            dataSource : this.state.dataSource.cloneWithRows(result.data || [])
        });
    },
    doAgree: function(data){
        employeeAction.agreeApplication({
            id: data.id,
            status: 2
        });
    },
    onPressRow: function(data){
        data.group = 1;
        data.mobiles = [data.mobile];
        Actions.contactDetail({
            title: data.userName,
            data: data
        });
    },
    renderNavigationBar: function(){
        return(
            <NavigationBar
                tintColor="#f9f9f9"
                title={{ title: this.props.title }}
                leftButton={<BlueBackButton />} />
            );
    },
    fetchData: function(text){
        employeeAction.getApplcationList();
    },
    renderRowRightBtn: function(data){
        if (data.status == 1) {
            return(
                <View style={{width: 64}}>
                    <Button
                    style={[commonStyle.buttonBlueFlex]}
                    onPress={()=>{this.doAgree(data)}} >
                        同意
                    </Button>
                </View>
                );
        };
        if ((data.status == 2 ) || (data.status == 5)) {
            return(
                <View style={{width: 64}}>
                    <Text
                    style={[commonStyle.textGray]} >
                        已同意
                    </Text>
                </View>
                );
        };
        if (data.status == 4) {
            return(
                <View style={{width: 64}}>
                    <Text
                    style={[commonStyle.textGray]} >
                        已加入
                    </Text>
                </View>
                );
        };
        return(<View />);
    },
    renderAvatar: function(data){
        if (!data) {
            return(<View style={contactsStyle.contactsItemCircle}/>);
        };
        if (data.avatar) {
            return(
                <Image
                  style={contactsStyle.contactsItemCircle}
                  source={{uri: data.avatar}} />
                );
        }else{
            var circleBackground = {
                backgroundColor: data.bgColor
            }
            return(
                <View style={[contactsStyle.contactsItemCircle, circleBackground]}>
                    <Text style={contactsStyle.contactsItemTitle}>{data.simpleUserName}</Text>
                </View>
                )
        }
    },
    renderRow: function(data){
        return(
            <TouchableHighlight
                style={commonStyle.settingItemWrapper}
                underlayColor='#eee'
                onPress={()=>{this.onPressRow(data)}}>
                <View
                style={commonStyle.settingItem}>
                    {this.renderAvatar(data)}
                    <View style={[commonStyle.settingDetailWrapper,{marginLeft: 10}]}>
                        <Text
                        style={commonStyle.settingDetail}>
                            {data.userName}
                        </Text>
                        <Text
                        style={[commonStyle.settingDetail, {marginTop: 10}]}>
                            {data.mobile}
                        </Text>
                    </View>
                    {this.renderRowRightBtn(data)}
                </View>
            </TouchableHighlight>
            );
    },
    renderEmptyRow: function(){
        return (
            <View style={commonStyle.emptyView}>
                <Text style={{fontSize:20, fontWeight:'800', paddingTop: 16, color:'#727272'}}>
                        快去邀请新的成员吧
                </Text>
            </View>
        )
    },
    renderListView: function(){
        if (!this.state.list || this.state.list.length == 0) {
            return this.renderEmptyRow();
        };
        return(
            <ListView
                style={contactsStyle.scrollView}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                contentContainerStyle={{paddingBottom: 40}} />
            );
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                {this.renderNavigationBar()}
                <ScrollView style={commonStyle.container}
                keyboardDismissMode={'interactive'}
                automaticallyAdjustContentInsets={false} >
                    {this.renderListView()}
                </ScrollView>
                <Modal ref={(ref)=>{this._modal = ref}}/>
            </View>
            );
    }
});
