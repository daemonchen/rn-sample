'use strict';

var alt = require('../../common/alt');
var attachAction = require('../../actions/attach/attachAction');
var attachService = require('../../services/attach/attachService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var util = require('../../common/util');
class AttachStore {
    constructor() {
        this.bindActions(attachAction);
        this.state = {};
    }
    transformData(responseData, fileData){
        var result = {};
        var fileTokenMap = responseData.data.fileTokenMap;
        for(var [k,v] of fileTokenMap){
            result['key'] = k;
            result['token'] = v;
        }
        result['uri'] = fileData.uri;
        result['params']['x:hostType'] = fileData.hostType;
        result['params']['x:hostId'] = fileData.hostId;
        result['params']['x:fileOrgName'] = fileData.fileOrgName;
        return result;
    }
    onCreate(data) {
        var params = {
            count: data.count
        }
        attachService.qiniuToken(params)
        .then((responseData) => {
            var options = this.transformData(responseData, data)
            attachAction.uploadToQiniu(options)
        }).done();

        this.preventDefault();
    }
    onUploadToQiniu(data){
        console.log('----before upload data', data);
        util.uploadToQiniu(data.uri, data.key, data.token, data.params, (result)=>{
            console.log('----uploadToQiniu result', result);
            // attachAction.createSuccess(responseData)
            this.preventDefault();
        });
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'

        // appConstants.memberList = responseData.data
        // asyncStorage.setItem('appConstants', appConstants);
        // this.mergeList(responseData)
        this.setState(responseData);
    }
    mergeList(responseData){
        asyncStorage.getItem('appConstants')
        .then((result)=>{
            if (!!result.attachList) {
                responseData.data = result.attachList.concat(responseData.data)
                this.setState(responseData);
            }else{
                this.setState(responseData);
            }
            appConstants.attachList = responseData.data
            asyncStorage.setItem('appConstants', appConstants);
        }).done();
    }
}

module.exports = alt.createStore(AttachStore, 'AttachStore');