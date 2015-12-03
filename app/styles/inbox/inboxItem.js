const React = require('react-native');

module.exports = React.StyleSheet.create({
  rowStyle: {
        padding: 16,
        flex: 1,
        flexDirection: 'row'
    },
    swipeWrapper:{
        backgroundColor: 'transparent'
    },
    rowTextWrapper:{
        flex: 1
    },
    inboxTitle: {
        color: '#212121',
        fontSize: 18,
        marginTop: 5,
        marginLeft: 10
    },
    inboxDetail:{
        fontSize: 14,
        marginTop:5,
        marginLeft: 10
    },
    inboxSubDetail: {
        fontSize: 14
    },
    timeLabel: {
        width:64,
        marginTop: 5,
        textAlign: 'right'
    },
    inboxIcon: {
        width: 50,
        height: 50
    },
    dot: {
        position: 'absolute',
        left: 45,
        top: 10
    }
});
