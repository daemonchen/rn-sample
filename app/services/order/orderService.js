'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    create: function(data){
        return http.post(NZAOM_INTERFACE.order, data)
    },
    get: function(data){
         var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
         return http.get(NZAOM_INTERFACE.order + urlParams)
    }
}