'use strict';

var alt = require('../../common/alt');
var commentAction = require('../../actions/comment/commentAction');
var commentService = require('../../services/comment/commentService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class commentStore {
    constructor() {
        this.bindActions(commentAction);
        this.state = {};
    }
    onCreate(data) {
        commentService.create(data)
        .then((responseData) => {
            commentAction.createSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onCreateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'create'

        // appConstants.memberList = responseData.data
        // asyncStorage.setItem('appConstants', appConstants);
        // this.mergeList(responseData)
        this.setState(responseData);
    }
    onAt(data){
        this.setState(data);
    }
}

module.exports = alt.createStore(commentStore, 'commentStore');