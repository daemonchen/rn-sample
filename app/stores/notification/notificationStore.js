'use strict';
var React = require('react-native');
var {
    AlertIOS
} = React
var alt = require('../../common/alt');
var notificationAction = require('../../actions/notification/notificationAction');

var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var util = require('../../common/util');
class NotificationStore {
    constructor() {
        this.bindActions(notificationAction);
        this.state = {};
    }
    onNotify(data) {
        this.setState(data);
    }
}

module.exports = alt.createStore(NotificationStore, 'NotificationStore');