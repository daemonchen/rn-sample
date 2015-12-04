'use strict';

var alt = require('../../common/alt');
var orderListAction = require('../../actions/order/orderListAction');
var orderListService = require('../../services/order/orderListService')
var asyncStorage = require('../../common/storage');
class OrderListStore {
    constructor() {
        this.bindActions(orderListAction);
        this.state = {};
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
        asyncStorage.setItem('orderList', {list: data.data});
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
        asyncStorage.getItem('orderList')
        .then((result)=>{
            if (!!result.list) {
                data.data = result.list.concat(data.data)
                this.setState(data);
            }else{
                this.setState(data);
            }
            asyncStorage.setItem('orderList', {list: data.data});
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
}

export default alt.createStore(OrderListStore, 'OrderListStore');