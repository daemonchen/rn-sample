'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getVerifyCode: function(data){
        return http.put(NZAOM_INTERFACE.verifycode, data)
    },
    doVerifyCode: function(data){
        var urlParams = '/{code}/mobile/{mobile}/type/{type}'.replace('{code}', data.code)
        .replace('{mobile}', data.mobile)
        .replace('{type}', data.type);
        return http.get(NZAOM_INTERFACE.verifycode + urlParams)
    },
    register: function(data){
        return http.post(NZAOM_INTERFACE.user, data)
    },
    login: function(data){
        return http.post(NZAOM_INTERFACE.login, data)
    },
    token: function(data){
        return http.get(NZAOM_INTERFACE.token)
    },
    system: function(data){
        return http.get(NZAOM_INTERFACE.system)
    }
}