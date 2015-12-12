'use strict';

var alt = require('../../common/alt');
var roleAction = require('../../actions/role/roleAction');
var roleService = require('../../services/role/roleService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class RoleStore {
    constructor() {
        this.bindActions(roleAction);
        this.state = {};
    }
    onGet(data) {
        roleService.get(data)
        .then((responseData) => {
            roleAction.getSuccess(responseData)
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

export default alt.createStore(RoleStore, 'RoleStore');