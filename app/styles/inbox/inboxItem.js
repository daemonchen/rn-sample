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
        flex: 1,
        fontSize: 16,
        marginLeft: 10
    },
    timeLabel: {
        width:64,
        textAlign: 'right'
    },
    inboxIcon: {
        width: 50,
        height: 50
    }
});
