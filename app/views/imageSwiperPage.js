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
    StyleSheet
} = React;


var commonStyle = require('../styles/commonStyle');
var styles = require('../styles/order/orderDetail');
var util = require('../common/util');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        console.log('--------->this.props.slides',this.props.slides);
        return {
            index: this.props.index || 0,
            autoplay: this.props.autoplay || false,
            loop: this.props.loop || true,
            slides: JSON.parse(this.props.slides)
        }
    },
    componentDidMount: function(){
    },
    componentWillUnmount: function() {
    },
    renderItem: function(item){
        return(
            <Image
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
    render: function(){
        return(
            <Swiper style={styles.wrapper} showsButtons={true}
            index={this.state.index}
            autoplay={this.state.autoplay}
            loop={this.state.loop}>
                {this.renderItems()}
            </Swiper>
            );
    }
})