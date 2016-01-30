'use strict';

var alt = require('../../common/alt');
var memberListAction = require('../../actions/member/memberListAction');
var memberListService = require('../../services/member/memberListService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class MemberListStore {
    constructor() {
        this.bindActions(memberListAction);
        this.state = {};
    }
    doCache(responseData){
        asyncStorage.getItem('appConstants')
        .then((data)=>{
            if(!!data){
                appConstants = data;
                appConstants.memberList = responseData.data
                asyncStorage.setItem('appConstants', appConstants);

            }
        }).done();
    }
    onGetList(data) {
        memberListService.getList(data)
        .then((responseData) => {
            memberListAction.getListSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onGetListSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'get'
        this.doCache(responseData);
        this.setState(responseData);
    }
}

module.exports = alt.createStore(MemberListStore, 'MemberListStore');