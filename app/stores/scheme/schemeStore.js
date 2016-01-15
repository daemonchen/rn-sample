'use strict';
var React = require('react-native');
var {
    AlertIOS
} = React
var alt = require('../../common/alt');
var schemeAction = require('../../actions/scheme/schemeAction');

var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var util = require('../../common/util');
class SchemeStore {
    constructor() {
        this.bindActions(schemeAction);
        this.state = {};
    }
    onChange(data){
        this.setState(data);
    }
}

module.exports = alt.createStore(SchemeStore, 'SchemeStore');