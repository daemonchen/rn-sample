'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    get: function(data){
        var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
        return http.get(NZAOM_INTERFACE.shareOrder + urlParams)
    },
    post: function(data){
        return http.post(NZAOM_INTERFACE.shareOrder, data)
    },
    put: function(data){
        return http.put(NZAOM_INTERFACE.shareOrder, data)
    },
    delete: function(data){
        var urlParams = '/order/{orderId}/customer/{customerId}'.replace('{orderId}', data.orderId)
        .replace('{customerId}', data.customerId);
        return http.delete(NZAOM_INTERFACE.shareOrder + urlParams)
    }
}