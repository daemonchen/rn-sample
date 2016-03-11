'use strict';

var React = require('react-native');
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {
  AppRegistry,
  StyleSheet,
  TabBarIOS,
  Image,
  Text,
  View,
  Animated
} = React;

var Button = require('../common/button');
var Swiper = require('../common/swiper')
var commonStyle = require('../styles/commonStyle');


//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.createClass({
    getInitialState: function(){
        return {
            index: this.props.index || 0,
            autoplay: this.props.autoplay || false,
            loop: this.props.loop || true,
            viewBounceValue: new Animated.Value(0)
        }
    },
    componentDidMount: function(){
        // LayoutAnimation.easeInEaseOut();
        Animated.spring(                          // 可选的基本动画类型: spring, decay, timing
          this.state.viewBounceValue,                 // 将`circleBounceValue`值动画化
          {
            toValue: 1,                         // 将其值以动画的形式改到一个较小值
            friction: 7,                          // Bouncier spring
          }
        ).start();

    },
    componentWillUnmount: function(){},
    goRegister: function(){
        Actions.register();
    },
    goLogin: function(){
        Actions.login();
    },
    renderSlider: function(){
        return(
            <View style={styles.imageGalleryWrapper}>
                <Swiper
                index={this.state.index}
                autoplay={this.state.autoplay}
                loop={this.state.loop}
                dot={this.renderDot()}
                activeDot={this.renderActiveDot()}
                paginationStyle={{
                              bottom: 70,
                            }}>
                    <Image style={styles.welcomeImage}
                    source={require('../images/welcome/slide1.png')} />
                    <Image style={styles.welcomeImage}
                    source={require('../images/welcome/slide2.png')} />
                    <Image style={styles.welcomeImage}
                    source={require('../images/welcome/slide3.png')} />
                </Swiper>
            </View>
            );
    },
    renderDot: function(){
        return(
            <View style={styles.dotStyle} />
            );
    },
    renderActiveDot: function(){
        return(
            <View style={styles.activeDotStyle} />
            );
    },
    render: function(){
        return (
            <Animated.View style={[styles.welcome,{
                flex: 1,
                transform: [                        // `transform`是一个有序数组（动画按顺序执行）
                    {
                        scale: this.state.viewBounceValue
                   }
                  ]
            }]}>
                {this.renderSlider()}
                <View style={styles.welcomeWrapper}>
                    <View style={{flex: 1}}>
                        <Button
                        style={commonStyle.buttonFlex}
                        onPress={this.goRegister} >
                            注册
                        </Button>
                    </View>
                    <View style={styles.sepVertical}/>
                    <View style={{flex: 1}}>
                        <Button
                        style={[commonStyle.buttonFlex]}
                        onPress={this.goLogin} >
                            登录
                        </Button>
                    </View>

                </View>
            </Animated.View>
        );
    }
});

var styles = StyleSheet.create({
    welcome: {
        backgroundColor: '#fff',
        flex: 1
    },
    imageGalleryWrapper: {
        backgroundColor: '#fff',
        width: width,
        flex: 1
    },
    welcomeImage:{
        width: width,
        // height: height
        flex: 1
        // width: width
        // marginTop: 100
    },
    dotStyle: {
        backgroundColor:'#fff',
        width: 7,
        height: 7,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#333',
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    activeDotStyle: {
        backgroundColor:'#333',
        width: 8,
        height: 8,
        borderRadius: 4,
        // borderWidth: 1,
        // borderColor: '#fff',
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    sepVertical: {
        height: 37,
        width: 1,
        marginTop: 6,
        backgroundColor: '#fff'
    },
    welcomeWrapper:{
        width: width,
        height: 49,
        flexDirection: 'row',
        backgroundColor: '#4285f4'
    }
});