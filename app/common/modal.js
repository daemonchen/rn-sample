'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');
var {View,
    Text,
    TextInput,
    Navigator,
    Modal,
    StyleSheet
} = React;

var appConstants = require('../constants/appConstants');
var asyncStorage = require('../common/storage');
var commonStyle = require('../styles/commonStyle');
var Button = require('../common/button.js');

var userAction = require('../actions/user/userAction');
var userStore = require('../stores/user/userStore');

var BlueBackButton = require('../common/blueBackButton');
var RightDoneButton = require('../common/rightDoneButton');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    mixins: [TimerMixin],
    showModal: function(content) {
        this.setState({
            modalVisible: true,
            content: content
        });
    },
    hideModal: function(){
        this.setState({
            modalVisible: false
        });
    },
    getInitialState: function(){
        return {
            content: '',
            animated: false,
            modalVisible: false,
            transparent: true
        }
    },
    render: function() {
        // var modalBackgroundStyle = {
        //   backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        // };
        // var innerContainerTransparentStyle = this.state.transparent
        //   ? {backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 20}
        //   : null;

        return (
          <View>
            <Modal
              animated={this.state.animated}
              transparent={this.state.transparent}
              visible={this.state.modalVisible}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.text}>{this.state.content}</Text>
                    </View>
                </View>
            </Modal>

          </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'transparent'
    },
    innerContainer: {
        marginHorizontal: 60,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
    },
    text: {
        color: '#fff'
    }
});