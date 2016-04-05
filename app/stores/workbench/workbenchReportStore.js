'use strict';

var alt = require('../../common/alt');
var workbenchReportAction = require('../../actions/workbench/workbenchReportAction');
var workbenchReportService = require('../../services/workbench/workbenchReportService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class WorkbenchReportStore {
    constructor() {
        this.bindActions(workbenchReportAction);
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
    onGet(data) {
        workbenchReportService.get(data)
        .then((responseData) => {
            workbenchReportAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.doCache(responseData)
        this.setState(responseData);
    }

}

module.exports = alt.createStore(WorkbenchReportStore, 'WorkbenchReportStore');