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
  View
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
            loop: this.props.loop || true
        }
    },
    componentDidMount: function(){
        // LayoutAnimation.easeInEaseOut();

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
            <View style={styles.welcome}>
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
            </View>
        );
    }
});

var styles = StyleSheet.create({
    welcome: {
        backgroundColor: '#fff',
        flex: 1
    },
    imageGalleryWrapper: {
        backgroundColor: '#000',
        width: width,
        height: height - 49
    },
    welcomeImage:{
        width: width,
        height: height - 49
        // width: width
        // marginTop: 100
    },
    dotStyle: {
        backgroundColor:'rgba(0,0,0,.2)',
        width: 5,
        height: 5,
        borderRadius: 4,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3
    },
    activeDotStyle: {
        backgroundColor: '#000',
        width: 8,
        height: 8,
        borderRadius: 4,
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