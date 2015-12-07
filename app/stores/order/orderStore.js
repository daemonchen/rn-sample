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

        // appConstants.memberList = responseData.data
        // asyncStorage.setItem('appConstants', appConstants);
        // this.mergeList(responseData)
        this.setState(responseData);
    }
}

export default alt.createStore(OrderStore, 'OrderStore');