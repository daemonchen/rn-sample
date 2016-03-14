const React = require('react-native');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
    topInfo:{
        // height: 174,
        paddingTop: 56,
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: 16
    },
    avatar:{
        marginTop: 16,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    nameWrapper: {
        width: width - 32,
        // borderBottomWidth: 1,
        paddingVertical: 22,
        // borderBottomColor: '#eee'
    },
    name: {
        textAlign: 'center',
        fontSize: 24
    },
    nameWhite: {
        color: '#fff',
    },
    avatarWrapper: {
        marginTop: 16,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    avatarTitle: {
        marginTop: 38,
        width: 100,
        textAlign: 'center',
        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: 24
    }
});