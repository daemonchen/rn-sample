'use strict';

var queryString = require('query-string')
var DeviceInfo = require('react-native-device-info');
var md5 = require('md5');
var util = require('./util');
var asyncStorage = require('./storage');
var appConstants = require('../constants/appConstants');

console.log("Device Unique ID", DeviceInfo.getUniqueID());
console.log('version--:', DeviceInfo.getVersion());


module.exports = {
    fetchOptions: {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-platform': 'IOS'
        }
    },
    getAuthToken: function(callback){
        return appConstants.xAuthToken;
    },
    getUrlParams: function(data){
        var result = data || {}
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
    get: function(url, data){
        url += '?' + this.getUrlParams(data)
        this.factoryHeader('GET');
        console.log('http get', url);
        return this.fetchData(url);
    },
    post: function(url, body){
        url += '?' + this.getUrlParams()
        this.factoryHeader('POST', body);
        console.log('http post', url, body);
        return this.fetchData(url);
    },
    put: function(url, body){
        url += '?' + this.getUrlParams()
        this.factoryHeader('PUT', body);
        console.log('http put', url, body);
        return this.fetchData(url);
    },
    delete: function(url){
        url += '?' + this.getUrlParams()
        this.factoryHeader('DELETE');
        console.log('http delete', url);
        return this.fetchData(url);
    },
    factoryHeader: function(type, data){
        this.fetchOptions.method = type;
        this.fetchOptions.headers['x-auth-token'] = this.getAuthToken();
        if(!!data){
            this.fetchOptions.body = JSON.stringify(data)
        }else{
            this.fetchOptions.body = ''
        }
    },
    fetchData: function(url){
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
            .then( res =>{
                console.log(res);
                return res;
            })
            .catch((error) => {
                util.alert('网络异常，请稍后再试');
              });
        }
}
