'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
var {
    View,
    Text,
    SegmentedControlIOS,
    StyleSheet
} = React;
var orderSegmentControl =  React.createClass({
    getInitialState: function(){
        return {
            selectedIndex: 0
        }
    },
    render:function(){
        return (
            <View style={{paddingHorizontal:16, paddingVertical: 8}}>
                <SegmentedControlIOS values={['未完成', '已完成']}
                tintColor={'#4285f4'}
                selectedIndex={this.state.selectedIndex}
                onChange={this.props.onSegmentChange} />
            </View>
        );
    }
})

module.exports = orderSegmentControl;