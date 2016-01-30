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
    centerWrapper: {
        width: width,
        alignItems: 'center'
    },
    alignCenter:{
        textAlign: 'center'
    },
    textGray:{
        color: '#727272'
    },
    textDark: {
        color: '#212121'
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
    commonTitle: {
        fontSize: 16
    },
    title: {
        fontSize: 14,
        paddingTop: 16,
        paddingBottom: 8,
        paddingHorizontal: 16,
        fontWeight: '400'
    },
    paddingHorizontal: {
        paddingLeft: 16,
        paddingRight: 16
    },
    topBorder: {
        borderTopWidth: 1 / React.PixelRatio.get(),
        borderTopColor: '#eee'
    },
    bottomBorder: {
        borderBottomWidth: 1 / React.PixelRatio.get(),
        borderBottomColor: '#eee'
    },
    greenButton: {
        width: width - 32,
        marginTop: 12,
        marginBottom: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: '500',
        color:'#fff',
        backgroundColor:'#34a853'
    },
    buttonBlueFlex: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 16,
        fontWeight: '500',
        color:'#fff',
        backgroundColor:'#4285f4',
        borderRadius: 5
    },
    blueButton: {
        width: width - 32,
        marginTop: 12,
        marginBottom: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontWeight: '500',
        color:'#fff',
        backgroundColor:'#4285f4'
    },
    button: {
        width: width - 32,
        height: 48,
        paddingVertical: 16,
        fontWeight: '500',
        fontSize: 16
    },
    textIcon: {
        marginTop: 5,
        marginRight: 16
    },
    textInputWrapper: {
        width: width - 32,
        flexDirection: 'row',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    textInputWrapperBlueBorder: {
        borderBottomColor: '#4285f4'
    },
    textInput: {
        flex: 1,
        minHeight: 24,
        lineHeight: 24,
        marginTop: 4,
        textAlign: 'justify',
        fontSize: 16
    },
    textInputIcon: {
        width: 24,
        height: 24,
        marginRight: 16
    },
    textAreaWrapper: {
        width: width - 32,
        height: 76,
        flexDirection: 'row',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    textArea: {
        fontSize: 16,
        width: width - 32,
        alignSelf: 'center',
        height: 76
    },
    logoutWrapper: {
        width: width,
        height: 49,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
    },
    logoutBorder: {
        width: width,
        alignItems: 'center',
        height: 48,
        borderTopWidth: 1 / React.PixelRatio.get(),
        borderTopColor: '#eee'
    },
    section: {
        // borderBottomWidth: 1 / React.PixelRatio.get(),
        // borderBottomColor: '#eee'
    },
    settingGroupsTitle: {
        color: '#727272',
        marginVertical: 10,
        paddingHorizontal: 15
    },
    settingGroups: {
        flex: 1,
        paddingTop: 8,
        backgroundColor: '#fff'
    },
    popoverWrapper: {
        width: 150,
        flexDirection: 'row'
    },
    popoverItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginHorizontal: 16
    },
    settingItemWrapper:{
        width: width,
        // height: 60,
        alignItems: 'center'
    },
    settingItem: {
        width: width - 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16
        // height: 60
    },
    settingIcon: {
        width: 24,
        height: 24,
        marginRight: 16
    },
    settingTitle: {
        fontSize: 16,
        color: '#212121',
        // height: 59,
        // paddingTop: 20,
        width: 96,
    },
    settingDetailWrapper: {
        flex: 1
    },
    settingDetail: {
        fontSize: 16,
        flex: 1,
        flexDirection: 'row'
        // height: 59,
        // paddingTop: 20,
    },
    settingDetailTextRight: {
        textAlign: 'right'
    },
    settingArrow: {
        width: 24,
        height: 24
    },
    activityIndicator: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#3F51B5',
        flexDirection: 'column',
        paddingTop: 25
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'white'
    },
    articleTitle: {
        textAlign: 'center',
        fontSize: 20,
        paddingVertical: 10
    },
    articleTime: {
        textAlign: 'right',
        fontSize: 14,
        paddingVertical: 10,
        paddingRight: 16
    },
    articleDetail: {
        textAlign: 'center',
        fontSize: 16,
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    copyright:{
        alignItems: 'center',
        width: width,
        paddingBottom:16
    },
    copyrightItem:{
        paddingVertical: 8
    },
    emptyView:{
        height:height * 2/3,
        justifyContent:'center',
        alignItems:'center'
    },
    collectionItem: {
        flex: 1,
        paddingBottom: 6
    },
    collectionItemPaddingRight: {
        paddingRight: 3
    },
    collectionItemPaddingLeft: {
        paddingLeft: 3
    },
    collectionImage: {
        flex: 1,
        height: width/2,
        resizeMode: 'cover'
    },
    collectionTitle: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 5,
        marginTop: width/2 - 24,
        width: width/2,
        color: '#fff'
    }
});
