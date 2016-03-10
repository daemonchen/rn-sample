'use strict';

import React, {
    View,
    Text,
    SegmentedControlIOS,
    StyleSheet
} from 'react-native'
import NavigationBar from '../../../common/react-native-navbar/index';

module.exports =  React.createClass({
    getInitialState: function(){
        return {
            selectedIndex: 0
        }
    },
    render:function(){
        return (
            <View style={styles.segmentedStyle}>
                <SegmentedControlIOS values={['任务', '详情', '成员', '动态' ]}
                tintColor={'#4285f4'}
                selectedIndex={this.state.selectedIndex}
                onChange={this.props.onSegmentChange} />
            </View>
        );
    }
})
var styles = StyleSheet.create({
    segmentedStyle:{
        paddingHorizontal:16,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderBottomWidth:1 / React.PixelRatio.get(),
        borderBottomColor:'#d5d5d5'
    }
});