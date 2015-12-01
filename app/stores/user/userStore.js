'use strict';

var alt = require('../../common/alt');
var userAction = require('../../actions/user/userAction');
var userService = require('../../services/user/userService')
class UserStore {
    constructor() {
        this.bindActions(userAction);

        this.state = {
            status: 200,
            code: ''
        };
    }

    onGetVerifyCode(data) {
        userService.getVerifyCode(data)
        .then((responseData) => {
            userAction.getVerifyCodeSuccess(responseData)
        }).done();;
        return false;
    }
    onGetVerifyCodeSuccess(data){
        console.log('--success data:', data);
        this.setState(data);

    }
}

export default alt.createStore(UserStore, 'UserStore');