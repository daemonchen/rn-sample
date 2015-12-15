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
            <View style={{padding:16}}>
                <SegmentedControlIOS values={['任务', '动态', '成员', '附件']}
                selectedIndex={this.state.selectedIndex}
                onChange={this.props.onSegmentChange} />
            </View>
        );
    }
})
