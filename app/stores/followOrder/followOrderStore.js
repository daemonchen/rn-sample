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
        this.doCache(responseData);
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
            this.doCache(data);
        }).done();
    }
    onFollow(data) {
        followOrderService.post(data)
        .then((responseData) => {
            followOrderAction.followSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onFollowSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }
    onUnFollow(data) {
        followOrderService.delete(data)
        .then((responseData) => {
            followOrderAction.unFollowSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUnFollowSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'
        this.setState(responseData);
    }

}

module.exports = alt.createStore(FollowOrderStore, 'FollowOrderStore');