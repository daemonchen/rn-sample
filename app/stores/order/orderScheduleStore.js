'use strict';

var alt = require('../../common/alt');
var orderScheduleAction = require('../../actions/order/orderScheduleAction');
var orderScheduleService = require('../../services/order/orderScheduleService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class OrderScheduleStore {
    constructor() {
        this.bindActions(orderScheduleAction);
        this.state = {};
    }

    onCreate(data) {
        orderScheduleService.create(data)
        .then((responseData) => {
            orderScheduleAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'

        this.setState(responseData);
    }

}

module.exports = alt.createStore(OrderScheduleStore, 'OrderScheduleStore');