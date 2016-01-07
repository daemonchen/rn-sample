'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
var {
    View,
    Text,
    Image,
    WebView,
    ScrollView,
    Dimensions,
    TouchableHighlight,
    TouchableOpacity,
    TouchableWithoutFeedback,
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
            visibleHeight: Dimensions.get('window').height,
            scalesPageToFit: true,
            url: url
        }
    },
    componentDidMount: function(){
    },
    componentWillUnmount: function() {
    },

    renderNavigationBar: function(){
        return(
            <NavigationBar
                title={{ title: '任务描述'}}
                leftButton={<BlueBackButton />} />
            );
    },
    injectedJavaScript: function(){
        return 'var NzmJavascriptHandler = {imageZoom: function(imageSrc, imageSrcList){alert(imageSrc);}}'.trim();
    },
    render: function(){
        return(
            <View style={{height: this.state.visibleHeight}} >
                {this.renderNavigationBar()}
                <ScrollView style={styles.main}
                contentContainerStyle={{alignItems: 'center'}}
                keyboardDismissMode={'interactive'} >
                    <WebView
                        automaticallyAdjustContentInsets={false}
                        style={styles.webView}
                        url={this.state.url}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        injectedJavaScript={this.injectedJavaScript()}
                        scalesPageToFit={this.state.scalesPageToFit} />
                </ScrollView>
            </View>
            );
    }
})