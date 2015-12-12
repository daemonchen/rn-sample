'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    update: function(data){
        return http.fileUpload('POST', NZAOM_INTERFACE.avatar, data.uri, data.params)
    },
    delete: function(){
        return http.delete(NZAOM_INTERFACE.avatar)
    }
}