'use strict';
var React = require('react-native');
var {
    AlertIOS
} = React
var alt = require('../../common/alt');
var followOrderAction = require('../../actions/followOrder/followOrderAction');
var followOrderService = require('../../services/followOrder/followOrderService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var util = require('../../common/util');
class FollowOrderStore {
    constructor() {
        this.bindActions(followOrderAction);
        this.state = {};
    }
    onGet(data) {
        followOrderService.get(data)
        .then((responseData) => {
            followOrderAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.setState(responseData);
    }
    onUpdate(data) {
        followOrderService.post(data)
        .then((responseData) => {
            followOrderAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }

}

module.exports = alt.createStore(FollowOrderStore, 'FollowOrderStore');