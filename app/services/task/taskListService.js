'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        var urlParams = '/{orderId}'.replace('{orderId}', data.orderId);
        return http.get(NZAOM_INTERFACE.taskList + urlParams)
    },
    updateList: function(data){
        return http.put(NZAOM_INTERFACE.updateTaskStatus, data)
    },
    deleteList: function(data){
        var urlParams = '/{jobId}'.replace('{jobId}', data.jobId);
        return http.delete(NZAOM_INTERFACE.task + urlParams)
    }
}