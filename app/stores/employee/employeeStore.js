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
}

module.exports = alt.createStore(EmployeeStore, 'EmployeeStore');