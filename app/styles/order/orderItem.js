const React = require('react-native');
//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
  rowStyle: {
        padding: 12,
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
        marginTop: 5,
        // backgroundColor: '#000',
        // flexDirection: 'column'
    },
    orderTitle: {
        fontSize: 16,
        // flex:1,
        paddingBottom: 10
    },
    orderContent: {
        // flex: 1,
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

        width: 50,
        height: 50
    },
    checkIconWrapper: {
        width: 36,
        height: 36,
        // marginLeft: 15,
        marginTop: 10
        // marginRight: 16
    },
    checkIcon: {
        width: 32,
        height: 32,
        marginTop: 2,
        marginLeft: 2
    },
    progressBar: {
        backgroundColor: '#D5D5D5',
        borderRadius: 4,
        height: 8
    },
    progressBarFill: {
        height: 8,
        backgroundColor: '#4285f4'
    },
    percent: {
        width: 50,
        height:50,
        textAlign: 'center',
        position: 'absolute',
        left: 14,
        top: 30
    }
});
