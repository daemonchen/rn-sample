'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    create: function(data){
        return http.post(NZAOM_INTERFACE.customer, data)
    },
    delete: function(data){
        var urlParams = '/{id}'.replace('{id}', data.id);
        return http.delete(NZAOM_INTERFACE.customer + urlParams)
    }
}