'use strict';

var React = require('react-native');
var {View, Text, StyleSheet} = React;
var Radio = require('react-native-radio-button-classic');
var Option = Radio.Option;
var CircleProgressView = require('../common/circleProgress')
var _navigator, _topNavigator = null;

var Item = React.createClass({
  render: function() {
    var { title, description } = this.props;

    return (
      <View style={{ paddingTop: 7, paddingLeft: 10 }}>
        <Text style={styles.title}>{ title }</Text>
        <Text style={styles.description}>{ description }</Text>
      </View>
    );
  }
})

var TabView = React.createClass ({
    getInitialState: function(){
        _navigator = this.props.navigator;
        _topNavigator = this.props.route.topNavigator;
        return {
            progress:0.3,
            optionSelected: 1
        }
    },
    onSelect(index) {
        this.setState({
          optionSelected: index + 1
        });
    },
    render: function(){
        return (
            <View style={styles.container}>
                <Text style={{textAlign:'center', marginTop: 64}}>Tab1 #{this.props.route.title}</Text>
                <CircleProgressView
                  progress={this.state.progress}
                  lineWidth={5}
                  lineCap={CircleProgressView.LineCapSquare}   // LineCapButt | LineCapRound | LineCapSquare
                  circleRadius={20}
                  circleColor='#ff7300'
                  circleUnderlayColor='#e6e6e6'
                  style={styles.circle}/>
                <Radio onSelect={this.onSelect.bind(this)} defaultSelect={this.state.optionSelected - 1}>
                  <Option color="gray" selectedColor="#008BEF">
                    <Item title="First Options" description="This is your First Option"/>
                  </Option>
                  <Option color="gray" selectedColor="#008BEF">
                    <Item title="Second Options" description="This is your Second Option"/>
                  </Option>
                  <Option color="gray" selectedColor="#008BEF">
                    <Item title="Third Options" description="This is your Third Option"/>
                  </Option>
                </Radio>

                <View style={{ paddingTop: 40 }}>
                  <Text>You have selected option {this.state.optionSelected}</Text>
                </View>
            </View>
        );
    }
})

var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        alignItems: 'center'
    },
    circle:{
    }
});

module.exports = TabView;