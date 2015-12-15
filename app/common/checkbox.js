'use strict';

var React = require('react-native');

var {
  StyleSheet,
  PropTypes,
  Image,
  Text,
  View,
  TouchableHighlight
} = React;

module.exports = React.createClass({
  propTypes: {
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    checked: PropTypes.bool,
    onChange: PropTypes.func
  },

  getDefaultProps() {
    return {
      label: 'Label',
      labelBefore: false,
      checked: false
    }
  },

  onChange() {
    if(this.props.onChange){
      this.props.onChange(!this.props.checked);
    }
  },

  render() {
    var source = require('../images/common/cb_disabled.png');

    if(this.props.checked){
      source = require('../images/common/cb_enabled.png');
    }

    var container = (
      <View style={styles.container}>
        <Image
          style={styles.checkbox}
          source={source}/>
        <View style={styles.labelContainer}>
          <Text style={[this.props.labelStyle, styles.label]}>{this.props.label}</Text>
        </View>
      </View>
    );

    if (this.props.labelBefore) {
      container = (
        <View style={styles.container}>
          <View style={styles.labelContainer}>
            <Text style={[this.props.labelStyle, styles.label]}>{this.props.label}</Text>
          </View>
          <Image
            style={styles.checkbox}
            source={source}/>
        </View>
      );
    }

    return (
      <TouchableHighlight onPress={this.onChange} underlayColor='white'>
        {container}
      </TouchableHighlight>
    )
  }
});

var styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkbox: {
    width: 26,
    height: 26
  },
  labelContainer: {
    marginLeft: 10,
    marginRight: 10
  },
  label: {
    fontSize: 15,
    lineHeight: 15,
    color: 'grey',
  }
});