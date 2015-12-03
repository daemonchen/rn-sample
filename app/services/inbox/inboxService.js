'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        return http.get(NZAOM_INTERFACE.message, data)
    },
    updateList: function(data){
        return http.put(NZAOM_INTERFACE.message, data)
    },
    deleteList: function(data){
        var urlParams = '/{msgId}'.replace('{msgId}', data.msgId);
        return http.delete(NZAOM_INTERFACE.message + urlParams)
    },
    getInvite: function(data){
        var urlParams = '/{id}'.replace('{id}', data.id);
        return http.get(NZAOM_INTERFACE.invite + urlParams)
    },
    agreeInvite: function(data){
        return http.put(NZAOM_INTERFACE.invite, data)
    }
}