'use strict';

var alt = require('../../common/alt');
var templateListAction = require('../../actions/template/templateListAction');
var templateListService = require('../../services/template/templateListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class TaskListStore {
    constructor() {
        this.bindActions(templateListAction);
        this.state = {};
    }

    onGetList(data) {
        templateListService.getList(data)
        .then((responseData) => {
            templateListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.setState(responseData);
    }
    onDelete(data){
        templateListService.deleteList(data)
        .then((responseData) => {
            templateListAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'delete'
        this.setState(responseData);
    }
}

export default alt.createStore(TaskListStore, 'TaskListStore');