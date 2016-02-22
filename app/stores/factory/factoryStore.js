'use strict';

var alt = require('../../common/alt');
var factoryAction = require('../../actions/factory/factoryAction');
var factoryService = require('../../services/factory/factoryService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class FactoryStore {
    constructor() {
        this.bindActions(factoryAction);
        this.state = {};
    }
    onGet(data) {
        factoryService.get(data)
        .then((responseData) => {
            factoryAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'

        this.setState(responseData);
    }
    onGetList(data) {
        factoryService.getList(data)
        .then((responseData) => {
            factoryAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'getList'

        this.setState(responseData);
    }
    onCreate(data) {
        factoryService.create(data)
        .then((responseData) => {
            factoryAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'

        this.setState(responseData);
    }
}

module.exports = alt.createStore(FactoryStore, 'FactoryStore');