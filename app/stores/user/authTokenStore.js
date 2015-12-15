'use strict';

var alt = require('../../common/alt');
var authTokenAction = require('../../actions/user/authTokenAction');
var userService = require('../../services/user/userService')
var asyncStorage = require('../../common/storage');
class AuthTokenStore {
    constructor() {
        this.bindActions(authTokenAction);
        this.state = {};
    }

    onUpdateToken(data) {
        userService.token(data)
        .then((responseData) => {
            authTokenAction.updateTokenSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateTokenSuccess(data){
        if (!data) {return false};
        data.type = 'updateToken'
        this.setState(data);
    }
}

module.exports = alt.createStore(AuthTokenStore, 'AuthTokenStore');