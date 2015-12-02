const React = require('react-native');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
    scrollView:{
        paddingHorizontal: 16,
        flex: 1
    },
    contactsItem: {
        width: width - 32,
        paddingVertical: 16,
        flexDirection: 'row'
    },
    contactsItemCircle: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    contactsItemIcon: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: 10,
        top: 12
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
        color: '#727272',
        fontWeight: 'bold',
        flex: 1,
        paddingLeft: 10
    }
});
