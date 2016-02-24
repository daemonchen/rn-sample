'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){//获取我的消息列表
        return http.get(NZAOM_INTERFACE.messageCategories, data)
    },
    updateMessage: function(data){
        return http.put(NZAOM_INTERFACE.message, data)
    },
    deleteMessage: function(data){
        var urlParams = '/{msgId}'.replace('{msgId}', data.msgId);
        return http.delete(NZAOM_INTERFACE.message + urlParams)
    },
    deleteMessageCategory: function(data){
        var urlParams = '/{categoryId}'.replace('{categoryId}', data.categoryId);
        return http.delete(NZAOM_INTERFACE.message + urlParams)
    },
    getInvite: function(data){
        var urlParams = '/{id}'.replace('{id}', data.id);
        return http.get(NZAOM_INTERFACE.invite + urlParams)
    },
    getMessageOrder: function(data){
        var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
        return http.get(NZAOM_INTERFACE.messageOrder + urlParams, data)
    },
    getMessageSystem: function(data){
        return http.get(NZAOM_INTERFACE.messageSystem, data)
    },
    agreeInvite: function(data){
        return http.put(NZAOM_INTERFACE.invite, data)
    }
}