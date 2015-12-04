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
        appConstants.memberList = responseData.data
        asyncStorage.setItem('appConstants', appConstants);
        this.setState(responseData);
    }
}

export default alt.createStore(MemberListStore, 'MemberListStore');