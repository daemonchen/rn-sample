import React from 'react-native';

//获取可视窗口的宽高
var util = require('../../common/util.js');
var {
    width, height, scale
} = util.getDimensions();

module.exports = React.StyleSheet.create({
    main: {
        flex: 1
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 0
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
    sectionText: {
        fontSize: 14,
        fontWeight: '400',
        paddingHorizontal: 16
    },
    sectionHeder:{
        backgroundColor: '#fff',
        paddingTop: 16,
        paddingBottom: 8
    },

    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingVertical: 16,
        borderBottomWidth: 1 / React.PixelRatio.get(),
        borderBottomColor: '#E0E0E0'
    },
    sepLine:{
        width: width - 32,
        // marginHorizontal: 16,
        margin: 16,
        height: 1,
        backgroundColor: '#E0E0E0'
    },
    pieContainer: {
        width: width-32,
        height: width-32,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 16
    }
});