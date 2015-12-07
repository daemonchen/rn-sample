'use strict';
var React = require('react-native')
var NavigationBar = require('react-native-navbar');
var {
    View,
    Text,
    TextInput,
    ListView,
    Navigator,
    ScrollView,
    StyleSheet
} = React

var commonStyle = require('../../../styles/commonStyle');

var BlueBackButton = require('../../../common/blueBackButton');
var RightDoneButton = require('../../../common/rightDoneButton');

var templateAction = require('../../../actions/template/templateAction');
var templateStore = require('../../../stores/template/templateStore');

var util = require('../../../common/util');

var _navigator, _topNavigator = null;

module.exports = React.createClass({
    getInitialState: function(){
        return {}
    },
    componentDidMount: function(){
        this.unlisten = templateStore.listen(this.onChange);
    },
    componentWillUnmount: function() {
        this.unlisten();
    },
    onOrderlistChange: function(){
        var result = templateStore.getState();
        if (result.status != 200 && !!result.message) {
            util.alert(result.message);
            return;
        }
        if (result.type == 'create') {
            _navigator.popToTop();
        };
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
        // _navigator.pop();
        templateAction.create({
            templateName: this.state.title || '',
            description: this.state.description || '',
            orderId: this.props.route.data.id
        });
    },
    render: function(){
        return(
            <ScrollView keyboardShouldPersistTaps={false}
            style={commonStyle.container}>
                <NavigationBar
                    title={{title: this.props.route.title}}
                    leftButton={<BlueBackButton navigator={_topNavigator} />}
                    rightButton={<RightDoneButton onPress={this.onPressDone} />} />
                <View style={styles.main}>
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
                        multiline={true}
                        value={this.state.description}
                        onChangeText={this.onChangeDescribeText} />
                    </View>
                </View>
            </ScrollView>
            );
    }
});