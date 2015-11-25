const React = require('react-native');

module.exports = React.StyleSheet.create({
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
    text: {
        fontSize: 16,
        color: '#4285f4',
        paddingHorizontal: 8
    },


    subText: {
        fontSize: 14,
        color: '#757575'
    },
    section: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 6,
        // borderBottomWidth: 1 / React.PixelRatio.get(),
        // borderBottomColor: '#E0E0E0'
    },
    sepLine:{
        // width: 300,
        height: 1,
        backgroundColor: '#E0E0E0'
    }
});