'use strict';

var alt = require('../../common/alt');
var taskAction = require('../../actions/task/taskAction');
var taskService = require('../../services/task/taskService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class TaskStore {
    constructor() {
        this.bindActions(taskAction);
        this.state = {};
    }

    onCreate(data) {
        taskService.create(data)
        .then((responseData) => {
            taskAction.createSuccess(responseData)
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
    onUpdate(data){
        taskService.update(data)
        .then((responseData) => {
            taskAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }
    onGet(data) {
        taskService.get(data)
        .then((responseData) => {
            taskAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'

        // appConstants.memberList = responseData.data
        // asyncStorage.setItem('appConstants', appConstants);
        // this.mergeList(responseData)
        this.setState(responseData);
    }
}

export default alt.createStore(TaskStore, 'TaskStore');