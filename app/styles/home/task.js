const React = require('react-native');

module.exports = React.StyleSheet.create({
  rowStyle: {
        padding: 16,
        borderBottomColor: '#E0E0E0',
        borderBottomWidth: 1 / React.PixelRatio.get(),
        flex: 1,
        flexDirection: 'row'
    },
    swipeWrapper:{
        backgroundColor: 'transparent'
    },
    rowText: {
        color: '#212121',
        fontSize: 16
    },
    circle:{
        width: 16,
        height: 16,
        borderRadius: 16/2,
        marginRight: 16,
        borderWidth: 1 / React.PixelRatio.get(),
        borderColor: '#333',
        backgroundColor: 'transparent'
    },
    circleDone:{
        borderColor:'#ff7300',
        backgroundColor: '#ff7300'
    }
});
