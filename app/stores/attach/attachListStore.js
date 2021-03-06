'use strict';

var alt = require('../../common/alt');
var attachListAction = require('../../actions/attach/attachListAction');
var attachListService = require('../../services/attach/attachListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class AttachListStore {
    constructor() {
        this.bindActions(attachListAction);
        this.state = {};
    }
    doCache(responseData){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.attachList = responseData.data;
                asyncStorage.setItem('appConstants', appConstants);

            }
        }).done();
    }
    onGetList(data) {
        attachListService.getList(data)
        .then((responseData) => {
            attachListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.doCache(responseData);
        this.setState(responseData);
    }
    onDelete(data){
        attachListService.deleteList(data)
        .then((responseData) => {
            attachListAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(responseData){
        var self = this;
        if (!responseData) {return false};
        responseData.type = 'delete'
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.attachList = self.removeItemFromCache(appConstants.attachList, responseData.data);
                asyncStorage.setItem('appConstants', appConstants);
                responseData.data = appConstants.attachList;
                self.setState(responseData);

            }
        }).done();
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

module.exports = alt.createStore(AttachListStore, 'AttachListStore');