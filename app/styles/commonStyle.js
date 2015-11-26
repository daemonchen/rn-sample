const React = require('react-native');

//获取可视窗口的宽高
var util = require('../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    textGray:{
        color: '#212121'
    },
    textDark: {
        color: '#727272'
    },
    textLight: {
        color: '#bdbdbd'
    },
    blue:{
        color:'#4285f4'
    },
    red: {
        color:'#ea4335'
    },
    green:{
        color: '#34a853'
    },
    yellow: {
        color: '#fbbc05'
    },
    sepLine: {
        color: '#eee'
    },
    title: {
        fontSize: 16,
        padding: 16,
        fontWeight: 'bold'
    },
    paddingHorizontal: {
        paddingLeft: 16,
        paddingRight: 16
    },
    blueButton: {
        width: width - 32,
        marginTop: 12,
        marginBottom: 12,
        paddingVertical: 16,
        fontSize: 16,
        color:'#fff',
        backgroundColor:'#4285f4'
    },
    button: {
        width: width - 32,
        marginTop: 10,
        marginBottom: 10,
        paddingVertical: 16,
        fontSize: 16,
        paddingVertical: 16
    },
    textInputWrapper: {//带有下划线的输入框
        width: width - 32,
        height: 40,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderBottomWidth: 1 / React.PixelRatio.get(),
        borderBottomColor: '#bdbdbd'
    },
    textInput: {
        width: width - 32,
        alignSelf: 'center',
        height: 40,
        fontSize: 16
    },
    settingGroups: {
        backgroundColor: '#fff'
    },
    settingItem: {
        width: width - 32,
        flexDirection: 'row',
        // alignItems: 'center',
        // paddingVertical: 16,
        height: 40,
        borderBottomWidth: 1 / React.PixelRatio.get(),
        borderBottomColor: '#bdbdbd'
    },
    settingTitle: {
        color: '#212121',
        width: 80,
        paddingVertical: 12
    },
    settingDetail: {
        flex: 1,
        paddingVertical: 12,
        textAlign: 'right'
    },
    settingArrow: {
        marginTop: 5,
        width: 48
    },
});
