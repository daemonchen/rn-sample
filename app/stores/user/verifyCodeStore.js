'use strict';

var alt = require('../../common/alt');
var verifyCodeAction = require('../../actions/user/verifyCodeAction');
var userService = require('../../services/user/userService')
var asyncStorage = require('../../common/storage');
class VerifyCodeStore {
    constructor() {
        this.bindActions(verifyCodeAction);
        this.state = {};
    }

    onGetVerifyCode(data) {
        // cache the mobile for next step:
        asyncStorage.setItem('userData', Object.assign(asyncStorage.getItem('userData'),{
            mobile: data.mobile
        }))

        userService.getVerifyCode(data)
        .then((responseData) => {
            verifyCodeAction.getVerifyCodeSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetVerifyCodeSuccess(data){
        this.setState(data);
    }
}

export default alt.createStore(VerifyCodeStore, 'VerifyCodeStore');