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
        asyncStorage.setItem('verifyData', {
            mobile: data.mobile
        })

        userService.getVerifyCode(data)
        .then((responseData) => {
            verifyCodeAction.getVerifyCodeSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetVerifyCodeSuccess(data){
        if (!data) {return false};
        data.type = 'get'
        this.setState(data);
    }
    onVerifyCode(data){
        userService.doVerifyCode(data)
        .then((responseData) => {
            verifyCodeAction.verifyCodeSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onVerifyCodeSuccess(data){
        if (!data) {return false};
        data.type = 'check';
        this.setState(data);
    }
}

export default alt.createStore(VerifyCodeStore, 'VerifyCodeStore');