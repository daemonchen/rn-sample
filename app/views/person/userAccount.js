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

var commonStyle = require('../../styles/commonStyle');
var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
var BlueBackButton = require('../../common/blueBackButton');

var ChangeName = require('./changeName');


module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            user: !!appConstants.user ? appConstants.user : {}
        }
    },
    componentDidMount: function(){
        this.getAppConstants();
    },
    componentWillUnmount: function() {
    },
    // componentWillReceiveProps: function(){
    //     this.setState({
    //         user: !!appConstants.user ? appConstants.user : {}
    //     });
    // },
    getAppConstants: function(){
        var self = this;
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data && !!data.xAuthToken){
                appConstants = data;
                if (this._timeout) {
                    this.clearTimeout(this._timeout);
                };
                this._timeout = this.setTimeout(function(){
                    self.setState({
                        user: !!appConstants.user ? appConstants.user : {}
                    });
                }, 350)
            }
        }).done();
    },
    goAccount: function(){
        Actions.changeName({
            title: '修改姓名'
        });
    },
    render: function(){
        return(
            <View style={commonStyle.container}>
                <NavigationBar
                    tintColor="#f9f9f9"
                    title={{title:'我的账号'}}
                    leftButton={<BlueBackButton />} />
                <View style={commonStyle.settingGroups}>
                    <TouchableHighlight
                        style={commonStyle.settingItemWrapper}
                        underlayColor='#eee'
                        onPress={this.goAccount}>
                        <View
                        style={[commonStyle.settingItem, commonStyle.bottomBorder]}>
                            <Text
                            style={commonStyle.settingTitle}>
                                姓名
                            </Text>
                            <Text
                            style={[commonStyle.settingDetail, commonStyle.settingDetailTextRight]}>
                                {this.state.user.userName}
                            </Text>
                            <Image
                            style={commonStyle.settingArrow}
                            source={require('../../images/common/arrow_right_gray.png')} />
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
            );
    }
});
var styles = StyleSheet.create({
    topInfo:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    avatar:{
        marginTop: 16,
        width: 100,
        height: 100
    },
    nameWrapper: {
        width: width - 32,
        borderBottomWidth: 1 / React.PixelRatio.get(),
        paddingVertical: 22,
        borderBottomColor: '#bdbdbd'
    },
    name: {
        textAlign: 'center',
        fontSize: 22
    }
});