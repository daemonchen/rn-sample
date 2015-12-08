'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        // var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
        return http.get(NZAOM_INTERFACE.template, data)
    },
    deleteList: function(data){
        var urlParams = '/{id}'.replace('{id}', data.id);
        return http.delete(NZAOM_INTERFACE.template + urlParams)
    }
}