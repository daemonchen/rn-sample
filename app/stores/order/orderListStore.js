'use strict';

var alt = require('../../common/alt');
var orderListAction = require('../../actions/order/orderListAction');
var orderListService = require('../../services/order/orderListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class OrderListStore {
    constructor() {
        this.bindActions(orderListAction);
        this.state = {};
    }
    doCache(responseData){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.orderList = responseData.data
                asyncStorage.setItem('appConstants', appConstants);

            }
        }).done();
    }
    onGetList(data) {
        orderListService.getList(data)
        .then((responseData) => {
            orderListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(data){
        if (!data) {return false};
        data.type = 'get'
        this.doCache(data);
        this.setState(data);
    }
    onLoadMore(data) {
        orderListService.getList(data)
        .then((responseData) => {
            orderListAction.loadMoreSuccess(responseData)
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
            if (!!result.orderList) {
                data.data = result.orderList.concat(data.data)
                this.setState(data);
            }else{
                this.setState(data);
            }
            this.doCache(data);
        }).done();
    }
    onDelete(data){
        orderListService.deleteList(data)
        .then((responseData) => {
            orderListAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(data){
        if (!data) {return false};
        data.type = 'delete'
        this.setState(data);
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

module.exports = alt.createStore(OrderListStore, 'OrderListStore');