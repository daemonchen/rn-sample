'use strict';

import React, {
    View,
    Text,
    SegmentedControlIOS,
    StyleSheet
} from 'react-native'
import NavigationBar from '../../common/react-native-navbar/index';

var HomeSegmentControl =  React.createClass({
    getInitialState: function(){
        return {
            selectedIndex: this.props.selectedIndex || 0
        }
    },
    componentWillReceiveProps: function(nextProps){
        this.setState({
            selectedIndex: nextProps.selectedIndex
        });
    },
    render:function(){
        return (
            <View style={styles.segmentedStyle}>
                <SegmentedControlIOS values={['待我完成', '我已完成']}
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
        backgroundColor: '#f9f9f9',
        borderBottomWidth:1 / React.PixelRatio.get(),
        borderBottomColor:'#d5d5d5'
    }
});

module.exports = HomeSegmentControl;