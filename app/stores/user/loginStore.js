'use strict';

var alt = require('../../common/alt');
var loginAction = require('../../actions/user/loginAction');
var userService = require('../../services/user/userService')
var asyncStorage = require('../../common/storage');
class LoginStore {
    constructor() {
        this.bindActions(loginAction);
        this.state = {};
    }

    onLogin(data) {
        userService.login(data)
        .then((responseData) => {
            loginAction.loginSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoginSuccess(data){
        if (!data) {return false};
        data.type = 'login'
        this.setState(data);
    }
}

export default alt.createStore(LoginStore, 'LoginStore');