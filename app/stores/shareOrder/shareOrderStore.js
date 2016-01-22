'use strict';
var React = require('react-native');
var {
    AlertIOS
} = React
var alt = require('../../common/alt');
var shareOrderAction = require('../../actions/shareOrder/shareOrderAction');
var shareOrderService = require('../../services/shareOrder/shareOrderService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var util = require('../../common/util');
class ShareOrderStore {
    constructor() {
        this.bindActions(shareOrderAction);
        this.state = {};
    }
    onGet(data) {
        shareOrderService.get(data)
        .then((responseData) => {
            shareOrderAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.setState(responseData);
    }
    onCreate(data) {
        shareOrderService.post(data)
        .then((responseData) => {
            shareOrderAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'
        this.setState(responseData);
    }
    onUpdate(data) {
        shareOrderService.put(data)
        .then((responseData) => {
            shareOrderAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }
    onDelete(data) {
        shareOrderService.delete(data)
        .then((responseData) => {
            shareOrderAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'delete'
        this.setState(responseData);
    }
}

module.exports = alt.createStore(ShareOrderStore, 'ShareOrderStore');