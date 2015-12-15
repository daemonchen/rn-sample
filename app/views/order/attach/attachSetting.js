'use strict';

var React = require('react-native');
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

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

module.exports = React.createClass({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            fileName: this.props.route.data.fileName
        }
    },
    onPressDone: function(){
        // _navigator.pop();
        // loginAction.login({
        //     mobile: this.state.mobile,
        //     password: md5(this.state.password)
        // });
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
                </View>
            </View>
            );
    }
})