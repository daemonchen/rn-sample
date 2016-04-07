'use strict';

var React = require('react-native');
import NavigationBar from '../../../common/react-native-navbar/index';
var Actions = require('react-native-router-flux').Actions;
var TimerMixin = require('react-timer-mixin');
import WebViewBridge from 'react-native-webview-bridge';
var {
    View,
    Text,
    Image,
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
                tintColor="#f9f9f9"
                title={{ title: this.props.title}}
                leftButton={<BlueBackButton />} />
            );
    },
    injectedJavaScript: function(){
        return `
        var NzmJavascriptHandler = {
            imageZoom: function(imageSrc, imageSrcList){
                var obj = {
                    imageSrc: imageSrc,
                    imageSrcList: imageSrcList
                }
                WebViewBridge.send(JSON.stringify(obj));
            }
        };
        function webViewBridgeReady(cb) {
            //checks whether WebViewBirdge exists in global scope.
            if (window.WebViewBridge) {
              cb(window.WebViewBridge);
              return;
            }

            function handler() {
              //remove the handler from listener since we don't need it anymore
              document.removeEventListener('WebViewBridge', handler, false);
              //pass the WebViewBridge object to the callback
              cb(window.WebViewBridge);
            }

            //if WebViewBridge doesn't exist in global scope attach itself to document
            //event system. Once the code is being injected by extension, the handler will
            //be called.
            document.addEventListener('WebViewBridge', handler, false);
          }

          webViewBridgeReady(function (webViewBridge) {
            WebViewBridge.onMessage = function (message) {
              alert('got a message from Native: ' + message);
            };
          });
        `;
    },
    onBridgeMessage: function (obj) {
        var result = JSON.parse(obj);
        result.imageSrcList = util.parseStringToJson(result.imageSrcList);
        var index = 0;
        for (var i = 0; i < result.imageSrcList.length; i++) {
            (result.imageSrc == result.imageSrcList[i]) && (index = i);
        };
        Actions.imageSwiperPage({
            index: index,
            slides: result.imageSrcList || []
        });
    },
    render: function(){
                        // source={{uri: this.state.url}}
        return(
            <View style={{height: this.state.visibleHeight}} >
                {this.renderNavigationBar()}
                <ScrollView style={styles.main}
                contentContainerStyle={{alignItems: 'center'}}
                keyboardDismissMode={'interactive'} >
                    <WebViewBridge
                        source={{uri: this.state.url}}
                        automaticallyAdjustContentInsets={false}
                        style={styles.webView}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        onBridgeMessage={this.onBridgeMessage}
                        injectedJavaScript={this.injectedJavaScript()}
                        scalesPageToFit={this.state.scalesPageToFit} />
                </ScrollView>
            </View>
            );
    }
})