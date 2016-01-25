'use strict';
var React = require('react-native');
var {
    AlertIOS
} = React
var alt = require('../../common/alt');
var followOrderAction = require('../../actions/followOrder/followOrderAction');
var followOrderService = require('../../services/followOrder/followOrderService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
var util = require('../../common/util');
class FollowOrderStore {
    constructor() {
        this.bindActions(followOrderAction);
        this.state = {};
    }
    onGet(data) {
        followOrderService.get(data)
        .then((responseData) => {
            followOrderAction.getSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get';
        appConstants.orderList = responseData.data
        asyncStorage.setItem('appConstants', appConstants);
        this.setState(responseData);
    }
    onLoadMore(data) {
        followOrderService.get(data)
        .then((responseData) => {
            followOrderAction.loadMoreSuccess(responseData)
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
            appConstants.orderList = data.data
            asyncStorage.setItem('appConstants', appConstants);
        }).done();
    }
    onUpdate(data) {
        followOrderService.post(data)
        .then((responseData) => {
            followOrderAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }

}

module.exports = alt.createStore(FollowOrderStore, 'FollowOrderStore');