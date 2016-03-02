'use strict';

var alt = require('../../common/alt');
var customerAction = require('../../actions/contact/customerAction');
var customerService = require('../../services/contact/customerService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class CustomerStore {
    constructor() {
        this.bindActions(customerAction);
        this.state = {};
    }

    onCreate(data) {
        customerService.create(data)
        .then((responseData) => {
            customerAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'

        this.setState(responseData);
    }
    onUpdate(data) {
        customerService.update(data)
        .then((responseData) => {
            customerAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'

        this.setState(responseData);
    }
    onDelete(data) {
        customerService.delete(data)
        .then((responseData) => {
            customerAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'delete'

        this.setState(responseData);
    }
}

module.exports = alt.createStore(CustomerStore, 'CustomerStore');