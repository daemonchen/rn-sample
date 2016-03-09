const React = require('react-native');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
    scrollView:{
        flex: 1
    },
    contactsItem: {
        width: width,
        padding: 10,
        flexDirection: 'row'
    },
    contactsItemCircle: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    contactsItemTitle:{
        position: 'absolute',
        width: 30,
        textAlign: 'center',
        left: 3,
        top: 12,
        color: '#fff',
        fontSize: 12
    },
    contactsItemDetail: {
        color: '#212121',
        flex: 1,
        fontSize: 16,
        paddingLeft: 10,
        paddingTop: 8
    },
    contactRightText: {
        width: 124,
        paddingTop: 10,
        fontSize: 14,
        textAlign: 'right'
    }
});
