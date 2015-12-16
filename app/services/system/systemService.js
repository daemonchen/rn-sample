'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    system: function(data){
        // var urlParams = '/{clientId}'.replace('{clientId}', data.clientId);
        return http.get(NZAOM_INTERFACE.system, data);
    }
}