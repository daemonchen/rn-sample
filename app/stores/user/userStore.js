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
}

export default alt.createStore(UserStore, 'UserStore');