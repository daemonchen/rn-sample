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
        userService.resetPassword(data)
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
}

export default alt.createStore(AuthStore, 'AuthStore');