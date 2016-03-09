'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    get: function(data){//获取关注订单列表
        return http.get(NZAOM_INTERFACE.followOrder, data)
    },
    post: function(data){//关注订单
        var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
        return http.post(NZAOM_INTERFACE.followOrder, data)
    },
    delete: function(data){//取消关注
        var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
        return http.delete(NZAOM_INTERFACE.followOrder + urlParams)
    }
}