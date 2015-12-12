'use strict';

var alt = require('../../common/alt');
var avatarAction = require('../../actions/avatar/avatarAction');
var avatarService = require('../../services/avatar/avatarService')
var asyncStorage = require('../../common/storage');
var appConstants = require('../../constants/appConstants');
class AvatarStore {
    constructor() {
        this.bindActions(avatarAction);
        this.state = {};
    }
    onUpdate(data) {
        avatarService.update(data)
        .then((responseData) => {
            avatarAction.updateSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onUpdateSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'update'

        this.setState(responseData);
    }
    onDelete(data) {
        avatarService.delete(data)
        .then((responseData) => {
            avatarAction.deleteSuccess(responseData)
        }).done();

        this.preventDefault();
    }
    onDeleteSuccess(responseData){
        if (!responseData) {return false};
        responseData.type = 'delete'

        this.setState(responseData);
    }
}

export default alt.createStore(AvatarStore, 'AvatarStore');