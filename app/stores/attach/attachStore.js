'use strict';
var React = require('react-native');
var {
    AlertIOS
} = React
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
        attachService.qiniuToken(data)
        .then((responseData) => {
            if (!responseData) {
                attachAction.createSuccess({});//如果上传失败，也要通知view去掉lodadingOverlay
                util.toast("上传失败:", responseData);
                return;
            };
            if (responseData.status != 200) {
                attachAction.createSuccess({});//如果上传失败，也要通知view去掉lodadingOverlay
                util.toast(responseData.message);
                return;
            };
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
        this.preventDefault();
    }
    onCreateSuccess(responseData){
        console.log('------create attach result', responseData, !responseData);

        responseData.type = 'create'

        this.setState(responseData);
        if (!responseData) {
            util.toast('上传失败')
        }else{
            util.toast('上传成功')
        };
        // util.toast('上传成功');
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