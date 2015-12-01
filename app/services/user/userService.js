'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getVerifyCode: function(data){
        return http.put(NZAOM_INTERFACE.verifycode, data)
    }
}