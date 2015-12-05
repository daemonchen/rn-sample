'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        return http.get(NZAOM_INTERFACE.accessory, data)
    },
    deleteList: function(data){
        var urlParams = '/{id}'.replace('{id}', data.id);
        return http.put(NZAOM_INTERFACE.accessory + urlParams)
    }
}