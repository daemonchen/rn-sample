const React = require('react-native');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

var styles = React.StyleSheet.create({
    topInfo:{
        // height: 174,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16
    },
    avatar:{
        marginTop: 16,
        width: 100,
        height: 100
    },
    nameWrapper: {
        width: width - 32,
        borderBottomWidth: 1 / React.PixelRatio.get(),
        paddingVertical: 22,
        borderBottomColor: '#bdbdbd'
    },
    name: {
        textAlign: 'center',
        fontSize: 22
    },
    contactsItemCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#000'
    },
    contactsItemTitle:{
        position: 'absolute',
        width: 100,
        textAlign: 'center',
        left: 3,
        top: 12,
        color: '#fff',
        fontSize: 12
    },
});