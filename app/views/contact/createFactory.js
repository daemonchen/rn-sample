'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    TextInput,
    StyleSheet
} = React;

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');
var Modal = require('../../common/modal');

var factoryAction = require('../../actions/factory/factoryAction');
var factoryStore = require('../../stores/factory/factoryStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            factoryName: ''
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = factoryStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
        this.getAppConstants();
    },
    getAppConstants: function(){
        var self = this;
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data && !!data.xAuthToken){
                appConstants = data;
                this.setTimeout(function(){
                    self.setState({
                        factoryName: !!appConstants.user ? appConstants.user.factoryName : ''
                    });
                }, 350)
            }
        }).done();
    },
    onChange: function() {
        var result = factoryStore.getState();
        if (result.type != 'create') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        appConstants.user.factoryId = result.data.factoryId;
        appConstants.user.factoryName = result.data.factoryName;
        asyncStorage.setItem('appConstants', appConstants)
        .then((error)=>{
            util.toast('企业添加成功');
            if (this._timeout) {
                this.clearTimeout(this._timeout);
            };
            this._timeout = this.setTimeout(()=>{
                Actions.pop();
            },2000);
        });
    },
    onChangeNameText: function(text){
        this.setState({
            factoryName: text
        });
    },
    doCommit: function(){
        if (!this.state.factoryName) {
            util.alert('请输入姓名');
            return;
        };
        factoryAction.create({
            factoryName: this.state.factoryName
        });
    },
    onPressDone: function(){
        this.doCommit();
    },
    onSubmitEditing: function(){
        this.doCommit();
    },
    render: function(){
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '新建企业'}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='请输入企业名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeNameText}
                        onSubmitEditing={this.onSubmitEditing} />
                    </View>
                    <Modal ref={(ref)=>{this._modal = ref}}/>
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    }
});