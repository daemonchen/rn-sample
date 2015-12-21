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
        fontSize: 16,
        flex:1,
        paddingBottom: 10
    },
    orderContent: {
        flex: 1,
        flexDirection: 'row'
    },
    orderLabel: {
        fontSize: 12,
        flex: 1
    },
    orderTextRight:{
        fontSize: 14,
        flex: 1,
        textAlign: 'right'
    },
    orderTextLeft:{
        fontSize: 14,
        flex: 1,
        textAlign: 'left'
    },
    circle: {
        width: 52,
        height: 52
    },
    percent: {
        width: 50,
        height:50,
        textAlign: 'center',
        position: 'absolute',
        left: 18,
        top: 34
    }
});
