import React, {
    StyleSheet
} from 'react-native'

const NAV_BAR_HEIGHT = 44;
const STATUS_BAR_HEIGHT = 20;
const NAV_HEIGHT = NAV_BAR_HEIGHT + STATUS_BAR_HEIGHT;

module.exports = {
  navBarContainer: {
    backgroundColor: 'white',
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
  },
  navBar: {
    height: NAV_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // paddingBottom: 5,
    borderBottomWidth:1 / React.PixelRatio.get(),
    borderBottomColor:'#d5d5d5'
  },
  customTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    alignItems: 'center',
  },
  navBarButton: {
    marginTop: 12,
  },
  navBarButtonText: {
    fontSize: 17,
    letterSpacing: 0.5,
    marginTop: 12,
  },
  navBarTitleText: {
    fontSize: 17,
    letterSpacing: 0.5,
    color: '#333',
    fontWeight: '500',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 7,
    textAlign: 'center',
  },
};