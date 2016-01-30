'use strict';
var React = require('react-native');
var {
    AlertIOS
} = React
var alt = require('../../common/alt');
var appAction = require('../../actions/app/appAction');

var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var util = require('../../common/util');
class AppStore {
    constructor() {
        this.bindActions(appAction);
        this.state = {};
    }
    onInit(data) {
        this.setState(data);
    }
}

module.exports = alt.createStore(AppStore, 'AppStore');