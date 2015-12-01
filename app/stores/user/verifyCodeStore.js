'use strict';

var alt = require('../../common/alt');
var verifyCodeAction = require('../../actions/user/verifyCodeAction');
var userService = require('../../services/user/userService')
var asyncStorage = require('../../common/storage');
class VerifyCodeStore {
    constructor() {
        this.bindActions(verifyCodeAction);
        this.state = {};
        this.verifyData = asyncStorage.getItem('verifyData');
    }

    onGetVerifyCode(data) {
        // cache the mobile for next step:
        console.log('ddd', this.verifyData);
        asyncStorage.setItem('verifyData', Object.assign(this.verifyData,{
            mobile: data.mobile
        }))

        userService.getVerifyCode(data)
        .then((responseData) => {
            verifyCodeAction.getVerifyCodeSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetVerifyCodeSuccess(data){
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
        data.type = 'check';
        this.setState(data);
    }
}

export default alt.createStore(VerifyCodeStore, 'VerifyCodeStore');