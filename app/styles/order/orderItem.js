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
    orderContentWrapper: {
        flex: 1,
        paddingLeft: 16,
        flexDirection: 'column'
    },
    orderTitle: {
        flex:1,
        paddingVertical: 5
    },
    orderContent: {
        flex: 1,
        paddingVertical: 5,
        flexDirection: 'row'
    },
    orderLabel: {
        fontSize: 12,
        flex: 1
    },
    orderTextRight:{
        fontSize: 12,
        flex: 1,
        textAlign: 'right'
    },
    orderTextLeft:{
        fontSize: 12,
        flex: 1,
        textAlign: 'left'
    },
    circle: {
        width: 42,
        height: 42
    },
    percent: {
        width: 40,
        height:40,
        textAlign: 'center',
        position: 'absolute',
        left: 16,
        top: 28
    }
});
