'use strict';

var React = require('react-native')
var queryString = require('query-string')
var DeviceInfo = require('react-native-device-info');
var md5 = require('md5');
var _ = require('underscore');
var util = require('./util');
var asyncStorage = require('./storage');
var appConstants = require('../constants/appConstants');


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
        if (!!appConstants.location) {
            result.lng = appConstants.location.coords.longitude
            result.lat = appConstants.location.coords.latitude
        };
        result.sign = this.md5Params(result);
        return queryString.stringify(result);
    },
    md5Params: function(params){
        var stringifyParams = util.stringifyObjectAlphabetical(params);
        return md5(stringifyParams + 'hXyL0XsW7uVYX89mbUivRH9vkeyZvcfb').toUpperCase();
    },
    get: function(url, data){
        url += '?' + this.getUrlParams(data)
        this.factoryFetchOptions('GET');
        console.log('[NZAOM]http get', url);
        return this.fetchData(url);
    },
    post: function(url, body){
        url += '?' + this.getUrlParams()
        this.factoryFetchOptions('POST', body);
        console.log('[NZAOM]http post', url, body);
        return this.fetchData(url);
    },
    put: function(url, body){
        url += '?' + this.getUrlParams()
        this.factoryFetchOptions('PUT', body);
        console.log('[NZAOM]http put', url, body);
        return this.fetchData(url);
    },
    delete: function(url){
        url += '?' + this.getUrlParams()
        this.factoryFetchOptions('DELETE');
        console.log('[NZAOM]http delete', url);
        return this.fetchData(url);
    },
    filesUpload: function(url, uris, params){
        url += '?' + this.getUrlParams(params)
        this.fetchOptions.method = 'POST';
        this.fetchOptions.headers['x-auth-token'] = this.getAuthToken();
        this.fetchOptions.headers['Content-Type'] = 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d';

        var data = new FormData()
        for (var i = 0; i < uris.length; i++) {
           data.append('file[]', {uri: uris[i], name: 'image.jpg', type: 'image/jpg'})

        };
        // _.each(params, (value, key) => {
        //     if (value instanceof Date) {
        //       data.append(key, value.toISOString())
        //     } else {
        //       data.append(key, String(value))
        //     }
        // })
        this.fetchOptions.body = data;
        console.log('http filesUpload',url, data);
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
            .catch((error) => {
                console.log(error);
                util.alert('服务器出错啦');
              });
    },
    fileUpload: function(type, url, fileURL, params){
        url += '?' + this.getUrlParams(params)
        this.fetchOptions.method = type;
        this.fetchOptions.headers['x-auth-token'] = this.getAuthToken();
        this.fetchOptions.headers['Content-Type'] = 'multipart/form-data; boundary=6ff46e0b6b5148d984f148b6542e5a5d';

        var data = new FormData()
         if (fileURL) {
           data.append('file', {uri: fileURL, name: 'image.jpg', type: 'image/jpg'})
         }
        // _.each(params, (value, key) => {
        //     if (value instanceof Date) {
        //       data.append(key, value.toISOString())
        //     } else {
        //       data.append(key, String(value))
        //     }
        // })
        this.fetchOptions.body = data;
        console.log('http fileUpload', data);
        return fetch(url, this.fetchOptions)
            .then(res => res.json())
            .catch((error) => {
                console.log(error);
                util.alert('服务器出错啦');
              });
    },
    factoryFetchOptions: function(type, data){
        this.fetchOptions.method = type;
        this.fetchOptions.headers['Content-Type'] = 'application/json';
        this.fetchOptions.headers['x-auth-token'] = this.getAuthToken();
        if(!!data){
            this.fetchOptions.body = JSON.stringify(data)
        }else{
            this.fetchOptions.body = ''
        }
    },
    fetchData: function(url){
        return fetch(url, this.fetchOptions)
            // .then(res => res.json())
            .then((res)=>{
                var result = null;
                try{
                    // console.log('[NZAOM]http response:', res);
                    result = res.json();
                }catch(error){
                    console.log('[NZAOM]http response to json error:', error);
                }
                appConstants.netError = false;
                return result;
            })
            // .then( res =>{
            //     console.log(res);
            //     return res;
            // })
            .catch((error) => {
                console.log('[NZAOM]http error:', error);
                if (!!appConstants.netError) {
                    return;
                };
                appConstants.netError = true;
                util.alert('网络异常，请稍后再试');
              });
        }
}
