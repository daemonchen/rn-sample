'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    TextInput,
    Navigator,
    StyleSheet
} = React;

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');
var Modal = require('../../common/modal');

var userAction = require('../../actions/user/userAction');
var userStore = require('../../stores/user/userStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var _navigator, _topNavigator = null;
module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            content: ''
        }
    },
    _modal: {},
    componentDidMount: function(){
        this.unlisten = userStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = userStore.getState();
        if (result.type != 'feedback') { return; };
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        this._modal.showModal('感谢您的建议');
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            this._modal.hideModal();
            _navigator.pop();
        },2000);
    },
    onChangeSuggestText: function(text){
        this.setState({
            content: text
        });
    },
    doCommit: function(){
        if (!this.state.content) {
            util.alert('请输入姓名');
            return;
        };
        userAction.feedback({
            content: this.state.content
        });
    },
    onPressDone: function(){
        this.doCommit();
    },
    onSubmitEditing: function(){
        this.doCommit();
    },
    render: function(){
        // <Button
        // style={commonStyle.blueButton}
        // onPress={this.doCommit} >
        //     提交
        // </Button>
        return (
            <View style={commonStyle.container}>
                <NavigationBar
                    title={{title: '意见反馈'}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textAreaWrapper}>
                        <TextInput placeholder='请输入您的产品意见，我们将不断优化产品体验'
                        secureTextEntry={true}
                        multiline={true}
                        style={commonStyle.textArea}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeSuggestText} />
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