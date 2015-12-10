'use strict';

var alt = require('../../common/alt');
var customerListAction = require('../../actions/contact/customerListAction');
var customerListService = require('../../services/contact/customerListService')
var asyncStorage = require('../../common/storage');
class CustomerListStore {
    constructor() {
        this.bindActions(customerListAction);
        this.state = {};
    }

    onGetList(data) {
        customerListService.getList(data)
        .then((responseData) => {
            customerListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(data){
        if (!data) {return false};
        data.type = 'get'
        this.setState(data);
    }
}

export default alt.createStore(CustomerListStore, 'CustomerListStore');