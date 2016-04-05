'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    create: function(data){
        return http.post(NZAOM_INTERFACE.order, data)
    },
    update: function(data){
        return http.put(NZAOM_INTERFACE.order, data)
    },
    updateStatus: function(){
        return http.put(NZAOM_INTERFACE.orderStatus, data)
    },
    get: function(data){//获取订单编辑页的数据
         var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
         return http.get(NZAOM_INTERFACE.orderV2 + urlParams)
    },
    getOrderExtra: function(data){
         var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
         return http.get(NZAOM_INTERFACE.orderExtra + urlParams)
    }
}