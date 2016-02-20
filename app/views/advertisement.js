'use strict';

var React = require('react-native');
// var TimerMixin = require('react-timer-mixin');
import codePush from "react-native-code-push";
var Actions = require('react-native-router-flux').Actions;
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Navigator,
  ActivityIndicatorIOS,
  Image,
  Text,
  View,
  Animated
} = React;



var commonStyle = require('../styles/commonStyle');
var authTokenStore = require('../stores/user/authTokenStore');
// var Modal = require('../common/modal');
var Button = require('../common/button.js');
//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    // mixins: [TimerMixin],
    getInitialState: function(){
        return {
            startCircleDiameter: 0,
            endCircleDiameter: 40,
            xCenterOrigin: (width - 40) / 2,
            yCenterOrigin: (height - 40) / 2,
            circleBounceValue: new Animated.Value(0),
            viewBounceValue: new Animated.Value(0)
        }
    },
    // _modal: {},
    componentDidMount: function(){
        codePush.sync();//静默更新
        this.unAuthTokenlisten = authTokenStore.listen(this.onAuthTokenChange);
        this.state.viewBounceValue.setValue(0);   //默认隐藏登陆注册模块
        Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
          this.state.circleBounceValue,                 // 将`circleBounceValue`值动画化
          {
            toValue: 0.8,
            tension: 20,                        // 将其值以动画的形式改到一个较小值
            friction: 7,                          // Bouncier spring
          }
        ).start();                                // 开始执行动画
    },
    componentWillUnmount: function() {
        this.unAuthTokenlisten();
    },
    onAuthTokenChange: function(){
        var result = authTokenStore.getState();
        console.log('-----auth token result', result);
        if (result.status != 200 && !!result.message) {
            this.showLoginBlock();
            return;
        }
    },
    goRegister: function(){
        Actions.register();
    },
    goLogin: function(){
        Actions.login();
    },
    renderCircleItem: function(params){
        return(
            <Animated.View style={{
                position: 'absolute',
                width: this.state.circleBounceValue.interpolate({
                           inputRange: [0, 0.8, 1],
                           outputRange: [10, 40, 40]
                        }),
                height: this.state.circleBounceValue.interpolate({
                           inputRange: [0, 0.8, 1],
                           outputRange: [10, 40, 40]
                        }),
                borderRadius: this.state.circleBounceValue.interpolate({
                           inputRange: [0, 0.8, 1],
                           outputRange: [5, 20, 20]
                        }),
                backgroundColor: params.backgroundColor,
                transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                    {
                        translateX: this.state.circleBounceValue.interpolate({
                           inputRange: [0, 0.8, 1],
                           outputRange: [params.startX, params.endX, params.endX]
                        })
                   },
                   {
                        translateY: this.state.circleBounceValue.interpolate({
                           inputRange: [0, 0.8, 1],
                           outputRange: [params.startY, params.middleY, params.endY]
                        })
                   }
                  ]
            }} />
            );
    },
    showLoginBlock: function(){
        Animated.parallel([
            Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
              this.state.circleBounceValue,                 // 将`circleBounceValue`值动画化
              {
                toValue: 1,
                tension: 10,                        // 将其值以动画的形式改到一个较小值
                friction: 7,                          // Bouncier spring
              }
            ),
            Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
              this.state.viewBounceValue,                 // 将`circleBounceValue`值动画化
              {
                toValue: 1,
                tension: 10,                        // 将其值以动画的形式改到一个较小值
                friction: 7,                          // Bouncier spring
              }
            ),
            ]).start();
    },
    renderLoginBlock: function(){
        return(
            <Animated.View style={[styles.welcomeWrapper, {
                transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                    {
                        scale: this.state.viewBounceValue
                   }
                  ]
            }]}>
                <Text style={[styles.welcomeText, commonStyle.textGray]} >
                欢迎使用你造么
                </Text>
                <Text style={[styles.welcomeText, commonStyle.textGray]}>生产管理从未如此轻松</Text>
                <Button
                style={commonStyle.blueButton}
                onPress={this.goRegister} >
                    注册
                </Button>
                <Button
                style={[commonStyle.button, commonStyle.blue]}
                onPress={this.goLogin} >
                    登录
                </Button>
            </Animated.View>
            );
    },
    render: function(){
                    // <ActivityIndicatorIOS
                    //     animating={true}
                    //     style={[commonStyle.activityIndicator, {height: 80}]}
                    //     size="small" />
                  // <Modal ref={(ref)=>{this._modal = ref}}/>
        return (
            <View style={commonStyle.container}>
                <View style={{width: width, height: height, backgroundColor: '#fff'}}>
                    {this.renderCircleItem({
                        backgroundColor: '#4285f4',
                        startX: (width - 10) / 2,
                        endX: this.state.xCenterOrigin - 60,
                        startY: height - 10,
                        middleY: this.state.yCenterOrigin,
                        endY: this.state.yCenterOrigin - 100
                    })}
                    {this.renderCircleItem({
                        backgroundColor: '#ea4335',
                        startX: (width - 10) / 2,
                        endX: this.state.xCenterOrigin - 20,
                        startY: height - 10,
                        middleY: this.state.yCenterOrigin + 40,
                        endY: this.state.yCenterOrigin + 40 - 100
                    })}
                    {this.renderCircleItem({
                        backgroundColor: '#fbbc05',
                        startX: (width - 10) / 2,
                        endX: this.state.xCenterOrigin + 20,
                        startY: height - 10,
                        middleY: this.state.yCenterOrigin,
                        endY: this.state.yCenterOrigin - 100
                    })}
                    {this.renderCircleItem({
                        backgroundColor: '#34a853',
                        startX: (width - 10) / 2,
                        endX: this.state.xCenterOrigin + 60,
                        startY: height - 10,
                        middleY: this.state.yCenterOrigin - 40,
                        endY: this.state.yCenterOrigin - 40 - 100
                    })}
                    {this.renderLoginBlock()}
                </View>
            </View>
        );
    }
});

var styles = StyleSheet.create({
    welcome: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center'
    },
    welcomeWrapper:{
        position:'absolute',
        bottom: 36,
        width: width,
        justifyContent: 'center',
        alignItems: 'center'
    },
    welcomeImage:{
        marginTop: 100
    },
    welcomeText: {
        fontSize: 20,
        paddingVertical: 12
    }
});