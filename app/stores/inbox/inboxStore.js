'use strict';

var alt = require('../../common/alt');
var inboxAction = require('../../actions/inbox/inboxAction');
var inboxService = require('../../services/inbox/inboxService')
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
    onGetListSuccess(data){
        if (!data) {return false};
        data.type = 'get'
        asyncStorage.setItem('inboxList', {list: data.data});
        this.setState(data);
    }
    onLoadMore(data) {
        inboxService.getList(data)
        .then((responseData) => {
            inboxAction.loadMoreSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoadMoreSuccess(data){
        if (!data || !data.data) {return false};
        data.type = 'get'
        this.mergeList(data)
    }
    mergeList(data){
        asyncStorage.getItem('inboxList')
        .then((result)=>{
            if (!!result.list) {
                data.data = result.list.concat(data.data)
                this.setState(data);
            }else{
                this.setState(data);
            }
            asyncStorage.setItem('inboxList', {list: data.data});
        }).done();
    }
    onUpdate(data){
        inboxService.updateList(data)
        .then((responseData) => {
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

export default alt.createStore(InboxStore, 'InboxStore');