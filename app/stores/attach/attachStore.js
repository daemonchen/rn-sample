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
        this.setState(responseData);
    }
}

export default alt.createStore(AttachStore, 'AttachStore');