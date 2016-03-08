'use strict';

var http = require('../../common/http');
var NZAOM_INTERFACE = require('../../common/interface');
module.exports = {
    getList: function(data){
        var url = NZAOM_INTERFACE.member.replace('{orderId}', data.orderId);
        return http.get(url)
    }
}