'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        return http.get(NZAOM_INTERFACE.customer)
    }
}