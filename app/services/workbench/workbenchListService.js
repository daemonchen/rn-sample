'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        var urlParams = '/{status}'.replace('{status}', data.status);
        return http.get(NZAOM_INTERFACE.workbench + urlParams)
    }
}