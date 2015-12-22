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
    onGet(data) {
        attachService.get(data)
        .then((responseData) => {
            attachAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.setState(responseData);
    }
    transformData(originResponseData, fileData){
        var responseData = Object.assign({}, originResponseData);
        var result = {
            uri: null,
            key: null,
            token: null,
            params: {
                'x:mimeType': ''
            }
        };
        var fileTokenMap = responseData.data.fileTokenMap;
        for(var k in fileTokenMap){
            if (fileTokenMap.hasOwnProperty(k)) {
                result['key'] = k;
                result['token'] = fileTokenMap[k];
            };
        }
        result['uri'] = fileData.uri;

        result.params['x:hostType'] = fileData.hostType;
        result.params['x:hostId'] = fileData.hostId;
        result.params['x:fileOrgName'] = fileData.fileOrgName;
        return result;
    }
    onCreate(data) {
        var paramsObj = {
            count: data.count
        }
        attachService.qiniuToken(paramsObj)
        .then((responseData) => {
            var options = this.transformData(responseData, data)
            attachAction.uploadToQiniu(options)
        }).done();

        this.preventDefault();
    }
    onUploadToQiniu(data){
        util.uploadToQiniu(data.uri, data.key, data.token, data.params, (result)=>{
            attachAction.createSuccess(result)
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
    onUpdate(data) {
        attachService.update(data)
        .then((responseData) => {
            attachAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }
}

module.exports = alt.createStore(AttachStore, 'AttachStore');