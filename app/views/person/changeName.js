'use strict';
var React = require('react-native')
var RefreshableListView = require('react-native-refreshable-listview')
var NavigationBar = require('react-native-navbar');
var {
    Text,
    TextInput,
    View,
    ListView,
    Image,
    Navigator,
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

var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            userName: appConstants.systemInfo.user.userName
        }
    },
    componentDidMount: function(){
        this.unlisten = userStore.listen(this.onChange)
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onChange: function() {
        var result = userStore.getState();
        if (result.type != 'update') { return; };
        if (result.status != 200 && !!result.message) {
            return;
        }
        appConstants.systemInfo.user = result.data;
        asyncStorage.setItem('appConstants', appConstants);
        _navigator.pop()
    },
    onPressDone: function(){
        // this.props.route.onCalendarPressDone(this.state.date);
        this.doChangeName();
        // _topNavigator.pop();
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
                    title={{title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
                    <View style={commonStyle.textInputWrapper}>
                        <TextInput placeholder='姓名'
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