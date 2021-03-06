'use strict';

var alt = require('../../common/alt');
var userAction = require('../../actions/user/userAction');
var userService = require('../../services/user/userService')
var asyncStorage = require('../../common/storage');
class UserStore {
    constructor() {
        this.bindActions(userAction);
        this.state = {};
    }

    onUpdate(data) {
        userService.update(data)
        .then((responseData) => {
            userAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(data){
        if (!data) {return false};
        data.type = 'update'
        this.setState(data);
    }
    onFeedback(data) {
        userService.feedback(data)
        .then((responseData) => {
            userAction.feedbackSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onFeedbackSuccess(data){
        if (!data) {return false};
        data.type = 'feedback'
        this.setState(data);
    }
}

module.exports = alt.createStore(UserStore, 'UserStore');