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

// var userAction = require('../../actions/user/userAction');
// var userStore = require('../../stores/user/userStore');

var BlueBackButton = require('../../common/blueBackButton');
var RightDoneButton = require('../../common/rightDoneButton');


module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            quantity: this.props.data.quantity || ''
        }
    },
    componentDidMount: function(){
        // this.unlisten = userStore.listen(this.onChange);
        // this.getAppConstants();
    },
    componentWillUnmount: function() {
        // this.unlisten();
    },

    onPressDone: function(){
        this.props.onQuantityPressDone(this.state.quantity);
        Actions.pop();
    },
    onChangeText: function(text){
        this.setState({
            quantity: text
        });
    },
    onSubmitEditing: function(){
        this.props.onQuantityPressDone(this.state.quantity);
        Actions.pop();
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
                        <TextInput placeholder='订单数量'
                        autoFocus={true}
                        style={commonStyle.textInput}
                        keyboardType={'number-pad'}
                        returnKeyType={'done'}
                        clearButtonMode={'while-editing'}
                        onChangeText={this.onChangeText}
                        value={this.state.quantity}
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