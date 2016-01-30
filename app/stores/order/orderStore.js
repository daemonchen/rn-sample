'use strict';

var alt = require('../../common/alt');
var orderAction = require('../../actions/order/orderAction');
var orderService = require('../../services/order/orderService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class OrderStore {
    constructor() {
        this.bindActions(orderAction);
        this.state = {};
    }

    onCreate(data) {
        orderService.create(data)
        .then((responseData) => {
            orderAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'

        this.setState(responseData);
    }
    onUpdate(data) {
        orderService.update(data)
        .then((responseData) => {
            orderAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'

        this.setState(responseData);
    }
    onGet(data) {
        orderService.get(data)
        .then((responseData) => {
            orderAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'

        this.setState(responseData);
    }
    onGetHeader(data) {
        orderService.getHeader(data)
        .then((responseData) => {
            orderAction.getHeaderSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetHeaderSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'getHeader'

        this.setState(responseData);
    }
}

module.exports = alt.createStore(OrderStore, 'OrderStore');