'use strict';

var alt = require('../../common/alt');
var attachAction = require('../../actions/attach/attachAction');
var attachService = require('../../services/attach/attachService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class AttachStore {
    constructor() {
        this.bindActions(attachAction);
        this.state = {};
    }

    onCreate(data) {
        attachService.create(data)
        .then((responseData) => {
            attachAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
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

export default alt.createStore(AttachStore, 'AttachStore');