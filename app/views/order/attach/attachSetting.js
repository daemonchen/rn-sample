'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
import NavigationBar from 'react-native-navbar'
var SearchBar = require('react-native-search-bar');
var {
    View,
    Text,
    TextInput,
    Image,
    Navigator,
    ListView,
    ScrollView,
    TouchableOpacity,
    ActionSheetIOS,
    StyleSheet
} = React;

var _navigator, _topNavigator = null;

var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var util = require('../../../common/util');

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');
var Modal = require('../../../common/modal');

var attachAction = require('../../../actions/attach/attachAction');
var attachStore = require('../../../stores/attach/attachStore');

module.exports = React.createClass({
    mixins: [TimerMixin],
    _modal: {},
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            fileName: this.props.route.data.fileName,
            id: this.props.route.data.accessoryId
        }
    },
    componentDidMount: function(){
        this.unlisten = attachStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function(){
        var result = attachStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        switch(result.type){
            case 'update':
                return this.doUpdate(result);
            default: return;
        }
    },
    doUpdate: function(result){
        this._modal.showModal('修改成功');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            this._modal.hideModal();
            _navigator.pop();
        },2000);
    },
    onPressDone: function(){
        attachAction.update({
            id: this.state.id,
            fileName: this.state.fileName
        });
    },
    onChangeText: function(text){
        this.setState({
            fileName: text
        });
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{ title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={[styles.main,{alignItems: 'center'}]}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='附件名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        value={this.state.fileName}
                        onChangeText={this.onChangeText} />
                    </View>
                    <Modal ref={(ref)=>{this._modal = ref}}/>
                </View>
            </View>
            );
    }
})