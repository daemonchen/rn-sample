var React = require('react-native');
var Overlay = require('react-native-overlay');
var BlurView = require('react-native-blur').BlurView;

var {
  View,
  ActivityIndicatorIOS,
  Text,
  StyleSheet,
} = React;

module.exports = React.createClass({
  getDefaultProps(): StateObject {
    return {
      isVisible: false
    }
  },

  render(): ReactElement {
    return (
      <Overlay isVisible={this.props.isVisible} aboveStatusBar={false}>
        <View style={styles.background} blurType="xlight">
            <Text style={styles.textStyle}>上传中</Text>
            <ActivityIndicatorIOS
                size="small"
                animating={true}
                style={styles.spinner} />
        </View>
      </Overlay>
    );
  }
});

var styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  textStyle:{
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 10
  }
});