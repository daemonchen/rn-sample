'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    get: function(data){
        var urlParams = '/{accessoryId}'.replace('{accessoryId}', data.accessoryId);
        return http.get(NZAOM_INTERFACE.accessory + urlParams)
    },
    create: function(data){
        return http.post(NZAOM_INTERFACE.accessory, data)
    },
    qiniuToken: function(data){
        return http.post(NZAOM_INTERFACE.qiniuToken, data)
    },
    update: function(data){
        return http.put(NZAOM_INTERFACE.accessory, data)
    }
}