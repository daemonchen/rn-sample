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
        fontSize: 16,
        marginTop: 5,
        marginLeft: 10
    },
    inboxDetail:{
        fontSize: 14,
        marginTop:10,
        marginLeft: 10
    },
    inboxSubDetail: {
        fontSize: 14,
        marginTop: 5,
        marginLeft: 10
    },
    timeLabel: {
        width:64,
        marginTop: 5,
        textAlign: 'right'
    },
    rightButton: {
        width:56,
        height: 30,
        fontSize: 14,
        color:'#fff',
        paddingTop: 5,
        marginTop: 5,
        borderRadius: 5,
        backgroundColor:'#4285f4'
    },
    inboxIcon: {
        width: 50,
        height: 50
    },
    dot: {
        position: 'absolute',
        left: 54,
        top: 15
    }
});
