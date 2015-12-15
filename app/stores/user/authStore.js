'use strict';

var alt = require('../../common/alt');
var authAction = require('../../actions/user/authAction');
var userService = require('../../services/user/userService')
var asyncStorage = require('../../common/storage');
class AuthStore {
    constructor() {
        this.bindActions(authAction);
        this.state = {};
    }

    onUpdate(data) {
        userService.updatePassword(data)
        .then((responseData) => {
            authAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(data){
        if (!data) {return false};
        data.type = 'update'
        this.setState(data);
    }
    onReset(data) {
        userService.resetPassword(data)
        .then((responseData) => {
            authAction.resetSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onResetSuccess(data){
        if (!data) {return false};
        data.type = 'reset'
        this.setState(data);
    }
}

module.exports = alt.createStore(AuthStore, 'AuthStore');