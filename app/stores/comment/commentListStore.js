'use strict';

var alt = require('../../common/alt');
var commentListAction = require('../../actions/comment/commentListAction');
var commentListService = require('../../services/comment/commentListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class CommentListStore {
    constructor() {
        this.bindActions(commentListAction);
        this.state = {};
    }

    onGetList(data) {
        commentListService.getList(data)
        .then((responseData) => {
            commentListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(data){
        if (!data) {return false};
        data.type = 'get'
        appConstants.commentList = data.data
        asyncStorage.setItem('appConstants', appConstants);
        this.setState(data);
    }
    onLoadMore(data) {
        commentListService.getList(data)
        .then((responseData) => {
            commentListAction.loadMoreSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onLoadMoreSuccess(data){
        if (!data || !data.data) {return false};
        data.type = 'get'
        this.mergeList(data)
    }
    mergeList(data){
        asyncStorage.getItem('appConstants')
        .then((result)=>{
            if (!!result.commentList) {
                data.data = result.commentList.concat(data.data)
                this.setState(data);
            }else{
                this.setState(data);
            }
            appConstants.commentList = data.data
            asyncStorage.setItem('appConstants', appConstants);
        }).done();
    }
    onUpdate(data){
        commentListService.updateList(data)
        .then((responseData) => {
            commentListAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(data){
        if (!data) {return false};
        data.type = 'update'
        this.setState(data);
    }
    onDelete(data){
        commentListService.deleteList(data)
        .then((responseData) => {
            commentListAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(response){
        if (!response) {return false};
        response.type = 'delete'
        this.setState(response);
    }
    removeItemFromCache(collection, id){
        for (var i = 0; i < collection.length; i++) {
            if(collection[i].id == id){
                collection.splice(i, 1)
            }
        };
        return collection;
    }
}

module.exports = alt.createStore(CommentListStore, 'CommentListStore');