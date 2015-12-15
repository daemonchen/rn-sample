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