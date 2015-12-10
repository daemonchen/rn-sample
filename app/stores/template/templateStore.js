'use strict';

var alt = require('../../common/alt');
var templateAction = require('../../actions/template/templateAction');
var templateService = require('../../services/template/templateService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class TemplateStore {
    constructor() {
        this.bindActions(templateAction);
        this.state = {};
    }

    onCreate(data) {
        templateService.create(data)
        .then((responseData) => {
            templateAction.createSuccess(responseData)
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
    onUpdate(data) {
        templateService.update(data)
        .then((responseData) => {
            templateAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'

        // appConstants.memberList = responseData.data
        // asyncStorage.setItem('appConstants', appConstants);
        // this.mergeList(responseData)
        this.setState(responseData);
    }
}

export default alt.createStore(TemplateStore, 'TemplateStore');