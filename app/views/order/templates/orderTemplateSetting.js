'use strict';
var React = require('react-native')
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    TextInput,
    ListView,
    ScrollView,
    StyleSheet
} = React

var commonStyle = require('../../../styles/commonStyle');

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var templateAction = require('../../../actions/template/templateAction');
var templateStore = require('../../../stores/template/templateStore');

var util = require('../../../common/util');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            templateStatus: this.props.target,//1新建 2 修改
            title: this.props.data.orderTitle || this.props.data.templateName,
            description: this.props.data.description
        }
    },
    componentDidMount: function(){
        this.unlisten = templateStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function(){
        var result = templateStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        util.toast(result.message);
        if (this._timeout) {
            this.clearTimeout(this._timeout);
        };
        this._timeout = this.setTimeout(()=>{
            Actions.pop();
        },2000);
        // if (result.type == 'create') {
        //     util.toast(result.message);
        //     if (this._timeout) {
        //         this.clearTimeout(this._timeout);
        //     };
        //     this._timeout = this.setTimeout(()=>{
        //         Actions.pop();
        //     },2000);
        // };
        // if (result.type == 'update') {
        //     util.toast(result.message);
        //     if (this._timeout) {
        //         this.clearTimeout(this._timeout);
        //     };
        //     this._timeout = this.setTimeout(()=>{
        //         Actions.pop();
        //     },2000);
        // };
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
    onPressDone: function(){
        console.log('------templateStatus', this.state.templateStatus);
        if (this.state.templateStatus == 1) {//create
            templateAction.create({
                templateName: this.state.title || '',
                description: this.state.description || '',
                orderId: this.props.data.orderId
            });
        }
        if (this.state.templateStatus == 2) {//update
            templateAction.update({
                templateName: this.state.title || '',
                description: this.state.description || '',
                id: this.props.data.templateId
            });
        }
    },
    render: function(){
        var description = (this.state.templateStatus == 1) ? '' : this.state.description
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: this.props.title}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <ScrollView style={styles.main}
                keyboardShouldPersistTaps={false}
                contentContainerStyle={{paddingBottom: 40, alignItems: 'center'}}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='模版名称'
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        value={this.state.title}
                        onChangeText={this.onChangeNameText}/>
                    </View>
                    <View style={commonStyle.textAreaWrapper}>
                        <TextInput placeholder='模版描述'
                        style={commonStyle.textArea}
                        clearButtonMode={'while-editing'}
                        returnKeyType={'done'}
                        onSubmitEditing={this.onPressDone}
                        value={description}
                        onChangeText={this.onChangeDescribeText} />
                    </View>
                </ScrollView>
            </View>
            );
    }
});
var styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: 'transparent',
    }
});