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
        // isReset: 如果是重复发送验证码的请求，会带上这个参数，值为'isReset'
        userService.getVerifyCode(data)
        .then((responseData) => {
            responseData.isReset = data.isReset;
            verifyCodeAction.getVerifyCodeSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetVerifyCodeSuccess(data){
        if (!data) {return false};
        data.type = data.isReset || 'get'
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
    onRegister(data){
        userService.register(data)
        .then((responseData) => {
            verifyCodeAction.registerSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onRegisterSuccess(data){
        if (!data) {return false};
        data.type = 'register';
        this.setState(data);
    }
}

export default alt.createStore(VerifyCodeStore, 'VerifyCodeStore');