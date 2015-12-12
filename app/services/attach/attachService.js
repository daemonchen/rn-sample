'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    create: function(data){
        return http.filesUpload(NZAOM_INTERFACE.file, data.uris, data.params)
    }
}