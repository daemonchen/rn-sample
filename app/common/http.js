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
    getUrlParams: function(){
        var result = {}
        result.appkey = 997251497892209797;
        result.imei = DeviceInfo.getUniqueID();
        result.imsi = DeviceInfo.getUniqueID();
        result.t = new Date().valueOf();
        result.sign = this.md5Params(result);
        return queryString.stringify(result);
    },
    md5Params: function(params){
        var stringifyParams = util.stringifyObjectAlphabetical(params);
        return md5(stringifyParams + 'hXyL0XsW7uVYX89mbUivRH9vkeyZvcfb').toUpperCase();
    },
    get: function(url){
        url += '?' + this.getUrlParams()
        this.fetchOptions.method = 'GET';
        this.fetchOptions.body = '';
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
            .catch((error) => {
                console.warn(error);
                util.alert('网络异常，请稍后再试');
              });
    },
    post: function(url, body){
        url += '?' + this.getUrlParams()
        this.fetchOptions.method = 'POST';
        this.fetchOptions.body = JSON.stringify(body);
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
            .catch((error) => {
                console.warn(error);
                util.alert('网络异常，请稍后再试');
              });
    },
    put: function(url, body){
        url += '?' + this.getUrlParams()
        this.fetchOptions.method = 'PUT';
        this.fetchOptions.body = JSON.stringify(body);
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
            .catch((error) => {
                console.warn(error);
                util.alert('网络异常，请稍后再试');
              });
    },
    delete: function(url){},
}
