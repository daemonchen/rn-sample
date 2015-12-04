'use strict';

var alt = require('../../common/alt');
var taskListAction = require('../../actions/task/taskListAction');
var taskListService = require('../../services/task/taskListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class TaskListStore {
    constructor() {
        this.bindActions(taskListAction);
        this.state = {};
    }

    onGetList(data) {
        taskListService.getList(data)
        .then((responseData) => {
            taskListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        appConstants.taskList = responseData.data
        asyncStorage.setItem('appConstants', appConstants);
        this.setState(responseData);
    }
    onLoadMore(data) {
        taskListService.getList(data)
        .then((responseData) => {
            taskListAction.loadMoreSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoadMoreSuccess(responseData){
        if (!responseData || !responseData.data) {return false};
        responseData.type = 'get'
        this.mergeList(responseData)
    }
    mergeList(responseData){
        asyncStorage.getItem('appConstants')
        .then((result)=>{
            if (!!result.taskList) {
                responseData.data = result.taskList.concat(responseData.data)
                this.setState(responseData);
            }else{
                this.setState(responseData);
            }
            appConstants.taskList = responseData.data
            asyncStorage.setItem('appConstants', appConstants);
        }).done();
    }
    onUpdate(data){
        taskListService.updateList(data)
        .then((responseData) => {
            taskListAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }
    onDelete(data){
        taskListService.deleteList(data)
        .then((responseData) => {
            taskListAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'delete'
        appConstants.taskList = this.removeItemFromCache(appConstants.taskList, responseData.data);
        asyncStorage.setItem('appConstants', appConstants);
        responseData.data = appConstants.taskList;
        this.setState(responseData);
    }
    removeItemFromCache(obj, id){
        for (var i = 0; i < obj.jobVOList.length; i++) {
            if(obj.jobVOList[i].jobDO.id == id){
                obj.jobVOList.splice(i, 1)
            }
        };
        return obj;
    }
}

export default alt.createStore(TaskListStore, 'TaskListStore');