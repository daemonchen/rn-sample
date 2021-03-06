const React = require('react-native');

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
    main: {
        backgroundColor: '#f7f7f7',
        paddingBottom: 44
    },
    commentTitle:{
        fontSize: 18,
        width: width,
        height: 56,
        paddingTop: 16,
        textAlign: 'center'
    },
    rowStyle:{
        flexDirection: 'row',
        flex: 1,
        padding: 16
    },
    detailWrapper:{
        flex: 1,
        marginLeft: 16,
        flexDirection: 'column'
    },
    nameWrapper: {
        flexDirection: 'row',
        flex: 1,
        height: 28

    },
    name:{
        flex: 1,
        textAlign: 'left'
    },
    time: {
        flex: 1,
        textAlign: 'right'
    },
    detail: {
        flex: 1
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    subName:{
        position: 'absolute',
        width: 30,
        textAlign: 'center',
        left: 3,
        top: 12,
        color: '#fff',
        fontSize: 12
    },
    commentBarWrapper: {
        width: width,
        flexDirection: 'row',
        height: 44,
        borderTopWidth: 1 / React.PixelRatio.get(),
        borderTopColor: '#bdbdbd'
    },
    commentSendButtonWrapper: {
        flex: 1,
        height: 44
    },
    commentSendButton: {
        flex: 1,
        textAlign:'center',
        justifyContent: 'center',
        paddingTop: 5,
        marginTop: 10,
        marginRight: 16
    },
    commentTextInput: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#f1f1f1',
        height: 28,
        marginTop: 8,
        paddingLeft: 4,
        color: '#bdbdbd',
        marginHorizontal: 16
    },
    commentAvatarCircleWrapper:{
        // fontSize: 16,
        flex: 1,
        flexDirection: 'row',
        height: 59,
        paddingTop: 11
    },
    commentAvatarCircle:{
        width: 36,
        height: 36,
        marginLeft: 10,
        borderRadius: 18
    },
    commentAvatarCircleText:{
        position: 'absolute',
        width: 30,
        textAlign: 'center',
        left: 3,
        top: 12,
        color: '#fff',
        fontSize: 12
    },
});
