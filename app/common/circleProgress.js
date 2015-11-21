// https://github.com/guodong000/react-native-circle-progress
'use strict';
var React = require('react-native');

var {
  NativeModules,
  requireNativeComponent,
  StyleSheet,
  PropTypes,
} = React;

var CircleProgress = React.createClass({
  propTypes: {
    progress: PropTypes.number,
    lineWidth: PropTypes.number,
    lineCap: PropTypes.string,
    circleRadius: PropTypes.number,
    foregroundColor: PropTypes.string,
    backgroundColor: PropTypes.string,
  },

  render: function() {
    let defaultProps = {
      progress: 0,
      lineWidth: 3,
      lineCap: NativeModules.CircleProgressManager.LineCapRound,
      circleColor: 'blue',
      circleUnderlayColor: 'transparent',
    }
    let props = {...defaultProps, ...this.props};

    return (
      <RCTCircleProgress {...props}
        style={[styles.base, this.props.style]}/>
    );
  },
});

var styles = StyleSheet.create({
  base: {
    width: 50,
    height: 50,
  },
});

var RCTCircleProgress = requireNativeComponent('RCTCircleProgress', null);

CircleProgress.LineCapButt = NativeModules.CircleProgressManager.LineCapButt;
CircleProgress.LineCapRound = NativeModules.CircleProgressManager.LineCapRound;
CircleProgress.LineCapSquare = NativeModules.CircleProgressManager.LineCapSquare;
module.exports = CircleProgress;