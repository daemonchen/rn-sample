'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var Swiper = require('react-native-swiper')
var {
    View,
    Text,
    Image,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    StyleSheet
} = React;


var commonStyle = require('../styles/commonStyle');
var styles = require('../styles/order/orderDetail');
var util = require('../common/util');

var BlueBackButton = require('../common/blueBackButton');
var Lightbox = require('react-native-lightbox');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        return {
            index: this.props.index || 0,
            autoplay: this.props.autoplay || false,
            loop: this.props.loop || true,
            slides: this.props.slides || []
        }
    },
    componentDidMount: function(){
    },
    componentWillUnmount: function() {
    },
    renderItem: function(item){
        return(
            <Image
                style={styles.imageGallery}
                resizeMode={Image.resizeMode.contain}
                source={{uri: item}} />
            );
    },
    renderItems: function(){
        var that = this;
        var items = this.state.slides.map(function (item, index) {
            return that.renderItem(item, index);
        });
        return items;
    },
    _onPressButton: function(){
        Actions.pop();
    },
    render: function(){
        console.log(this.state.index);
        return(
            <View>
                <NavigationBar
                    title={{ title: '图片预览'}}
                    leftButton={<BlueBackButton />} />
                <Swiper style={styles.imageGalleryWrapper}
                showsButtons={true}
                index={this.state.index}
                autoplay={this.state.autoplay}
                loop={this.state.loop}>
                    {this.renderItems()}
                </Swiper>
            </View>
            );
    }
})