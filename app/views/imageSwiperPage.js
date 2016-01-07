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


var commonStyle = require('../../../styles/commonStyle');
var styles = require('../../../styles/order/orderDetail');
var util = require('../../../common/util');
var http = require('../../../common/http');
var appConstants = require('../../../constants/appConstants');

var BlueBackButton = require('../../../common/blueBackButton');
var RightSettingButton = require('../../../common/rightSettingButton');

module.exports = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function(){
        var url = this.props.descriptionUrl + '?' + http.getWebViewUrlParams();
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
              source={{uri: item}} />
            );
    },
    renderItems: function(){
        var that = this;
        var items = this.slides.map(function (item, index) {
            return that.renderItem(item, index);
        });
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