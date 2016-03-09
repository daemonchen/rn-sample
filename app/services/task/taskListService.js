'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getDependencesList: function(data){
        var url = NZAOM_INTERFACE.taskDenendences.replace('{orderId}', data.orderId);
        return http.get(url)
    },
    // updateTaskStatus: function(data){
    //     return http.put(NZAOM_INTERFACE.task, data)
    // },
    deleteList: function(data){
        var urlParams = '/{jobId}'.replace('{jobId}', data.jobId);
        return http.delete(NZAOM_INTERFACE.task + urlParams)
    }
}