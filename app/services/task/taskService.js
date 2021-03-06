'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    create: function(data){
        return http.post(NZAOM_INTERFACE.task, data)
    },
    update: function(data){
        return http.put(NZAOM_INTERFACE.task, data)
    },
    get: function(data){
         var urlParams = '/{taskId}'.replace('{taskId}', data.taskId);
         return http.get(NZAOM_INTERFACE.task + urlParams)
    }
}