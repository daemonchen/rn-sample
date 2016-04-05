'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    get: function(data){
        // var urlParams = '/{status}'.replace('{status}', data.status);
        return http.get(NZAOM_INTERFACE.report, data)
    }
}