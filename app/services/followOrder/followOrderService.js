'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    get: function(data){
        return http.get(NZAOM_INTERFACE.followOrder, data)
    },
    post: function(data){
        return http.post(NZAOM_INTERFACE.followOrder, data)
    }
}