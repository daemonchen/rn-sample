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
    rowText: {
        color: '#212121',
        fontSize: 16,
        marginLeft: 10
    },
    circle: {
        width: 40,
        height: 40
    },
    percent: {
        width: 40,
        height:40,
        position: 'absolute',
        left: 22,
        top: 28
    }
});
