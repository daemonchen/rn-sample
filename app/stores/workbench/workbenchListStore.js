'use strict';

var alt = require('../../common/alt');
var workbenchListAction = require('../../actions/workbench/workbenchListAction');
var workbenchListService = require('../../services/workbench/workbenchListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class WorkbenchListStore {
    constructor() {
        this.bindActions(workbenchListAction);
        this.state = {};
    }

    onGetList(data) {
        workbenchListService.getList(data)
        .then((responseData) => {
            workbenchListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        appConstants.workbenchList = responseData.data
        asyncStorage.setItem('appConstants', appConstants);
        this.setState(responseData);
    }
    onLoadMore(data) {
        workbenchListService.getList(data)
        .then((responseData) => {
            workbenchListAction.loadMoreSuccess(responseData)
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
            appConstants.workbenchList = responseData.data
            asyncStorage.setItem('appConstants', appConstants);
        }).done();
    }
}

module.exports = alt.createStore(WorkbenchListStore, 'WorkbenchListStore');