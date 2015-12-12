'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    get: function(data){
         // var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
         return http.get(NZAOM_INTERFACE.role)
    }
}