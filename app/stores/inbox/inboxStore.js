'use strict';

var alt = require('../../common/alt');
var inboxAction = require('../../actions/inbox/inboxAction');
var inboxService = require('../../services/inbox/inboxService')
var appConstants = require('../../constants/appConstants');
var asyncStorage = require('../../common/storage');
class InboxStore {
    constructor() {
        this.bindActions(inboxAction);
        this.state = {};
    }

    onGetList(data) {
        inboxService.getList(data)
        .then((responseData) => {
            inboxAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(response){
        if (!response) {return false};
        response.type = 'get';
        appConstants.inboxList = response.data
        asyncStorage.setItem('appConstants', appConstants);
        this.setState(response);
    }
    onLoadMore(data) {
        inboxService.getList(data)
        .then((responseData) => {
            inboxAction.loadMoreSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoadMoreSuccess(response){
        if (!response || !response.data) {return false};
        response.type = 'get'
        this.mergeList(response)
    }
    mergeList(response){
        asyncStorage.getItem('appConstants')
        .then((result)=>{
            if (!!result.inboxList) {
                response.data = result.inboxList.concat(response.data)
                this.setState(response);
            }else{
                this.setState(response);
            }
            appConstants.inboxList = response.data
            asyncStorage.setItem('appConstants', appConstants);
        }).done();
    }
    onUpdate(data){
        inboxService.updateList(data)
        .then((responseData) => {
            responseData.readStatus = data.readStatus;
            inboxAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(data){
        if (!data) {return false};
        data.type = 'update'
        this.setState(data);
    }
    onDelete(data){
        inboxService.deleteList(data)
        .then((responseData) => {
            inboxAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(data){
        if (!data) {return false};
        data.type = 'delete'
        this.setState(data);
    }
    onGetInvite(data){
        inboxService.getInvite(data)
        .then((responseData) => {
            inboxAction.getInviteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetInviteSuccess(data){
        if (!data) {return false};
        data.type = 'getInvite'
        this.setState(data);
    }
    onAgreeInvite(data){
        inboxService.agreeInvite(data)
        .then((responseData) => {
            inboxAction.agreeInviteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onAgreeInviteSuccess(data){
        if (!data) {return false};
        data.type = 'agreeInvite'
        this.setState(data);
    }
}

module.exports = alt.createStore(InboxStore, 'InboxStore');