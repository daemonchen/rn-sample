'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {
    View,
    Text,
    SegmentedControlIOS,
    StyleSheet
} = React;
var HomeSegmentControl =  React.createClass({
    getInitialState: function(){
        return {
            selectedIndex: 0
        }
    },
    _onSegmentChange: function(event){
        this.setState({
          selectedIndex: event.nativeEvent.selectedSegmentIndex,
        });
    },
    _onSegmentValueChange: function(value){
        this.setState({
            value: value,
        });
    },
    render:function(){
        return (
            <View style={{padding:16}}>
                <SegmentedControlIOS values={['未完成', '已完成']}
                selectedIndex={this.state.selectedIndex}
                onChange={this._onSegmentChange}
                onValueChange={this._onSegmentValueChange} />
            </View>
        );
    }
})

module.exports = HomeSegmentControl;