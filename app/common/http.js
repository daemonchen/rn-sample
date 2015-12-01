'use strict';

var queryString = require('query-string')
var DeviceInfo = require('react-native-device-info');
var md5 = require('md5');
var util = require('./util');

console.log("Device Unique ID", DeviceInfo.getUniqueID());
console.log('version--:', DeviceInfo.getVersion());


module.exports = {
    fetchOptions: {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'x-auth-token':'abcd',
            'x-platform': 'IOS'
        }
    },
    factoryParams: function(params){
        params.appkey = 997251497892209797;
        params.appsecret = 'hXyL0XsW7uVYX89mbUivRH9vkeyZvcfb';
        params.imei = DeviceInfo.getUniqueID();
        params.t = new Date().valueOf();
        params.sign = this.md5Params(params);
        return params;
    },
    md5Params: function(params){
        var stringifyParams = util.stringifyObjectAlphabetical(params);
        return md5('secret' + stringifyParams + 'secret').toUpperCase();
    },
    get: function(url, params){
        if (params) {
            params = this.factoryParams(params);
            url += '?' + queryString.stringify(params)
        }
        this.fetchOptions.method = 'GET';
        this.fetchOptions.body = '';
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
    },
    post: function(url, body){
        var params = this.factoryParams(body);
        this.fetchOptions.method = 'POST';
        this.fetchOptions.body = JSON.stringify(params);
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
    },
    put: function(){},
    delete: function(){},
}
