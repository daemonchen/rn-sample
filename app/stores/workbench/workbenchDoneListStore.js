'use strict';

var alt = require('../../common/alt');
var workbenchDoneListAction = require('../../actions/workbench/workbenchDoneListAction');
var workbenchDoneListService = require('../../services/workbench/workbenchDoneListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class WorkbenchListStore {
    constructor() {
        this.bindActions(workbenchDoneListAction);
        this.state = {};
    }
    doCache(responseData){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.workbenchList = responseData.data
                asyncStorage.setItem('appConstants', appConstants);

            }
        }).done();
    }
    onGetList(data) {
        workbenchDoneListService.getList(data)
        .then((responseData) => {
            workbenchDoneListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.doCache(responseData)
        this.setState(responseData);
    }
    onLoadMore(data) {
        workbenchDoneListService.getList(data)
        .then((responseData) => {
            workbenchDoneListAction.loadMoreSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoadMoreSuccess(responseData){
        if (!responseData || !responseData.data) {return false};
        responseData.type = 'loadmore';
        console.log('---------loadmore result', responseData);
        this.mergeList(responseData)
    }
    mergeList(responseData){
        asyncStorage.getItem('appConstants')
        .then((result)=>{
            if (!!result.workbenchList) {
                responseData.data = result.workbenchList.concat(responseData.data)
                this.setState(responseData);
            }else{
                this.setState(responseData);
            }
            this.doCache(responseData)
        }).done();
    }
}

module.exports = alt.createStore(WorkbenchListStore, 'WorkbenchListStore');