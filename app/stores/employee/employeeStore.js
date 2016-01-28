'use strict';

var alt = require('../../common/alt');
var employeeAction = require('../../actions/employee/employeeAction');
var employeeService = require('../../services/employee/employeeService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class EmployeeStore {
    constructor() {
        this.bindActions(employeeAction);
        this.state = {};
    }

    onGet(data) {
        employeeService.get(data)
        .then((responseData) => {
            employeeAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'

        this.setState(responseData);
    }

    onGetApplcationList(data) {
        employeeService.getApplcationList(data)
        .then((responseData) => {
            employeeAction.getApplcationListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetApplcationListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'getApplcationList'

        this.setState(responseData);
    }

    onAgreeApplication(data) {
        employeeService.agreeApplication(data)
        .then((responseData) => {
            employeeAction.agreeApplicationSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onAgreeApplicationSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'agreeApplication'

        this.setState(responseData);
    }

    onCreate(data) {
        employeeService.create(data)
        .then((responseData) => {
            employeeAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'

        this.setState(responseData);
    }
    onDelete(data) {
        employeeService.delete(data)
        .then((responseData) => {
            employeeAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'delete'

        this.setState(responseData);
    }
    onJoin(data) {
        employeeService.joinFactory(data)
        .then((responseData) => {
            employeeAction.joinSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onJoinSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'join'

        this.setState(responseData);
    }
}

module.exports = alt.createStore(EmployeeStore, 'EmployeeStore');