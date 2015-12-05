const React = require('react-native');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
    main: {
        flex: 1
    },
    taskTotalText: {
        color:'#fff',
        textAlign:'center',
        paddingVertical: 5
    },
    rowStyle: {
        paddingRight: 16,
        paddingVertical: 5,
        // borderBottomColor: '#E0E0E0',
        // borderBottomWidth: 1 / React.PixelRatio.get(),
        flex: 1,
        flexDirection: 'row'
    },
    checkIconWrapper: {
        width: 54,
        height: 48,
        paddingLeft: 16,
        paddingRight: 10,
        paddingVertical: 10
    },
    checkIcon: {
    },
    contentWrapper: {
        flex: 1
    },
    taskItemCircle: {
        width: 36,
        height: 36,
        marginTop: 5,
        borderRadius: 18
    },
    taskItemTitle:{
        position: 'absolute',
        width: 30,
        textAlign: 'center',
        left: 3,
        top: 12,
        color: '#fff',
        fontSize: 12
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
        flexDirection: 'column'
    },
    timeline: {
        flex: 1,
        width: 2 / React.PixelRatio.get(),
        height: 36,
        backgroundColor: '#bdbdbd'
    },
    timelineDone: {
        backgroundColor: '#34a853'
    },
    rowText: {
        color: '#212121',
        fontSize: 14,
        paddingVertical: 5
    },
    attachImageWrapper: {
        alignItems: 'center'
        // paddingHorizontal: 64
    },
    attachImage: {
        width: 80,
        height: 80,
        marginLeft: 16,
        marginRight: 16
    },
    attachImageMiddle: {
        width: width - 32,
        height: height / 2
    },
    attachTitle: {
        height: 54,
        paddingVertical: 16,
        fontSize: 22,
        textAlign: 'center',
        fontWeight: '800'
    },
    attachItemText: {
        fontSize: 16,
        justifyContent: 'center'
    }
});
