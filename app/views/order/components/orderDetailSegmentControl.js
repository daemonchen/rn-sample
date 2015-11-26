'use strict';

var React = require('react-native');
var NavigationBar = require('react-native-navbar');
var {
    View,
    Text,
    SegmentedControlIOS,
    StyleSheet
} = React;
module.exports =  React.createClass({
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
                <SegmentedControlIOS values={['任务', '动态', '成员', '附件']}
                selectedIndex={this.state.selectedIndex}
                onChange={this._onSegmentChange}
                onValueChange={this._onSegmentValueChange} />
            </View>
        );
    }
})
