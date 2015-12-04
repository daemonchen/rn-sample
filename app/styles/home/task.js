const React = require('react-native');

module.exports = React.StyleSheet.create({
    rowStyle: {
        padding: 16,
        // borderBottomColor: '#E0E0E0',
        // borderBottomWidth: 1 / React.PixelRatio.get(),
        flex: 1,
        flexDirection: 'row'
    },
    swipeWrapper:{
        backgroundColor: 'transparent'
    },
    timelineWrapper:{
        width: 2 / React.PixelRatio.get(),
        position: 'absolute',
        left: 29,
        top: 0,
        bottom: 0,
        flexDirection: 'column',
        backgroundColor: '#34a853'
    },
    timeline: {
        width: 2 / React.PixelRatio.get(),
        flex: 1
    },
    timelineDone: {
        backgroundColor: '#34a853'
    },
    rowText: {
        color: '#212121',
        fontSize: 16,
        marginLeft: 10
    }
});
