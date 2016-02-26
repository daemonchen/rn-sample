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
    doCache(responseData){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.inboxList = responseData.data
                asyncStorage.setItem('appConstants', appConstants);

            }
        }).done();
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
        this.doCache(response);
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
            this.doCache(response);
        }).done();
    }
    onUpdate(data){
        inboxService.updateMessage(data)
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
        inboxService.deleteMessage(data)
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
    onDeleteList(data){
        inboxService.deleteMessageCategory(data)
        .then((responseData) => {
            inboxAction.deleteListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteListSuccess(data){
        if (!data) {return false};
        data.type = 'deleteList'
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
    doCacheMessageOrder(responseData){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.messageOrderList = responseData.data
                asyncStorage.setItem('appConstants', appConstants);

            }
        }).done();
    }
    onGetMessageOrder(data){
        inboxService.getMessageOrder(data)
        .then((responseData) => {
            inboxAction.getMessageOrderSuccess(responseData)
        }).done();
        this.preventDefault();
    }
    onGetMessageOrderSuccess(data){
        if (!data) {return false};
        data.type = 'getMessageOrder'
        this.doCacheMessageOrder(data);
        this.setState(data);
    }
    onLoadMoreMessageOrder(data) {
        inboxService.getMessageOrder(data)
        .then((responseData) => {
            inboxAction.loadMoreMessageOrderSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoadMoreMessageOrderSuccess(response){
        if (!response || !response.data) {return false};
        response.type = 'getMessageOrder'
        this.mergeMessageOrderList(response)
    }
    mergeMessageOrderList(response){
        asyncStorage.getItem('appConstants')
        .then((result)=>{
            if (!!result.inboxList) {
                response.data = result.messageOrderList.concat(response.data)
                this.setState(response);
            }else{
                this.setState(response);
            }
            this.doCacheMessageOrder(response);
        }).done();
    }
    doCacheMessageSystem(responseData){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.messageSystemList = responseData.data
                asyncStorage.setItem('appConstants', appConstants);

            }
        }).done();
    }
    onGetMessageSystem(data){
        inboxService.getMessageSystem(data)
        .then((responseData) => {
            inboxAction.getMessageSystemSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetMessageSystemSuccess(data){
        if (!data) {return false};
        data.type = 'getMessageSystem'
        this.doCacheMessageSystem(data);
        this.setState(data);
    }
    onLoadMoreMessageSystem(data) {
        inboxService.getMessageSystem(data)
        .then((responseData) => {
            inboxAction.loadMoreMessageSystemSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoadMoreMessageSystemSuccess(response){
        if (!response || !response.data) {return false};
        response.type = 'getMessageSystem'
        this.mergeMessageSystemList(response)
    }
    mergeMessageSystemList(response){
        asyncStorage.getItem('appConstants')
        .then((result)=>{
            if (!!result.inboxList) {
                response.data = result.messageSystemList.concat(response.data)
                this.setState(response);
            }else{
                this.setState(response);
            }
            this.doCacheMessageSystem(response);
        }).done();
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