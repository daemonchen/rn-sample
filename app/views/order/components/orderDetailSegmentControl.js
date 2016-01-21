'use strict';

var React = require('react-native');
import NavigationBar from 'react-native-navbar'
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
    render:function(){
        return (
            <View style={{paddingHorizontal:16, paddingVertical: 8}}>
                <SegmentedControlIOS values={['任务', '详情', '成员', '动态' ]}
                tintColor={'#4285f4'}
                selectedIndex={this.state.selectedIndex}
                onChange={this.props.onSegmentChange} />
            </View>
        );
    }
})
