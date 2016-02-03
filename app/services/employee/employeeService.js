'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    create: function(data){
        return http.post(NZAOM_INTERFACE.invite, data)
    },
    get: function(data){
        var urlParams = '/{userId}'.replace('{userId}', data.userId);
        return http.get(NZAOM_INTERFACE.user + urlParams)
    },
    delete: function(data){
        var urlParams = '/{userId}'.replace('{userId}', data.userId);
        return http.delete(NZAOM_INTERFACE.user + urlParams)
    },
    joinFactory: function(data){//申请加入一家企业
        return http.post(NZAOM_INTERFACE.apply, data);
    },
    getApplcationList: function(){//获取申请列表
        return http.get(NZAOM_INTERFACE.apply);
    },
    agreeApplication: function(data){//同意或者拒绝申请
        return http.put(NZAOM_INTERFACE.apply, data);
    }
}