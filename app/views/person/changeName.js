'use strict';
var React = require('react-native')
import NavigationBar from '../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    TouchableHighlight,
    ActivityIndicatorIOS,
    StyleSheet
} = React

var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var commonStyle = require('../../styles/commonStyle');
var Button = require('../../common/button.js');

var userAction = require('../../actions/user/userAction');
var userStore = require('../../stores/user/userStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');


module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            userName: appConstants.user.userName
        }
    },
    componentDidMount: function(){
        this.unlisten = userStore.listen(this.onChange);
        this.getAppConstants();
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    getAppConstants: function(){
        var self = this;
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data && !!data.xAuthToken){
                appConstants = data;
                self.setTimeout(function(){
                    self.setState({
                        userName: !!appConstants.user ? appConstants.user.userName : ''
                    });
                }, 350)
            }
        }).done();
    },
    onChange: function() {
        var result = userStore.getState();
        if (result.type != 'update') { return; };
        if (result.status != 200 && !!result.message) {
            return;
        }
        appConstants.user = result.data;
        asyncStorage.setItem('appConstants', appConstants);
        Actions.pop()
    },
    onPressDone: function(){
        // this.props.onCalendarPressDone(this.state.date);
        this.doChangeName();
    },
    onChangeNameText: function(text){
        this.setState({
            userName: text
        });
    },
    onSubmitEditing: function(){
        this.doChangeName();
    },
    doChangeName: function(){
        if (!this.state.userName) {
            util.alert('请输入姓名');
            return;
        };
        userAction.update({
            userName: this.state.userName
        });
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title: this.props.title}}
                    leftButton={<BlueBackButton />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='姓名'
                        autoFocus={true}
                        style={commonStyle.textInput}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeNameText}
                        value={this.state.userName}
                        onSubmitEditing={this.onSubmitEditing} />
                    </View>
                </View>
            </View>
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