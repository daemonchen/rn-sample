'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        return http.get(NZAOM_INTERFACE.orderList, data)
    },
    deleteList: function(data){
        var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
        return http.delete(NZAOM_INTERFACE.order + urlParams)
    }
}