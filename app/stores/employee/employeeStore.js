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

export default alt.createStore(EmployeeStore, 'EmployeeStore');